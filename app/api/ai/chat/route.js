import { auth, currentUser } from "@clerk/nextjs/server";
import { groqChat, FAST_MODELS } from "@/lib/groq";
import { prisma } from "@/lib/prisma";

// Cache user lookups for duration of request
const userCache = new Map();

export async function POST(req) {
  try {
    // Authenticate user
    let userId = null;
    let clerkUser = null;
    try {
      const { userId: authUserId } = await auth();
      userId = authUserId;
      if (userId) {
        try {
          clerkUser = await currentUser();
        } catch (e) {
          console.warn("Failed to fetch current user details", e);
        }
      }
    } catch (authError) {
      console.warn("Auth check failed, continuing as anonymous");
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return Response.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    const { messages, model, temperature, maxTokens, chatId } = body;

    // Validate messages exist
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Messages array is required and cannot be empty" },
        { status: 400 }
      );
    }

    // Validate message format
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return Response.json(
          { error: "Each message must have 'role' and 'content' properties" },
          { status: 400 }
        );
      }
    }

    // Check if there's already a system message
    const hasSystemMessage = messages.some(msg => msg.role === "system");

    // Optimized system message (shorter = faster)
    const systemMessage = {
      role: "system",
      content: "You are a helpful AI assistant. Provide clear, well-formatted responses using markdown when appropriate."
    };

    const finalMessages = hasSystemMessage ? messages : [systemMessage, ...messages];

    // Intelligent context management with optimized token calculation
    const MAX_TOKENS = 100000; // Safe limit below 128k
    const ESTIMATED_CHARS_PER_TOKEN = 4;

    // Function to estimate tokens quickly
    const estimateTokens = (text) => Math.ceil(text.length / ESTIMATED_CHARS_PER_TOKEN);

    // Build optimized message array
    let currentTokens = 0;
    const optimizedMessages = [];

    // 1. System message (always first)
    const sysMsg = finalMessages[0];
    const sysTokens = estimateTokens(sysMsg.content);
    optimizedMessages.push(sysMsg);
    currentTokens += sysTokens;

    // 2. Latest user message (always last)
    const latestMsg = finalMessages[finalMessages.length - 1];
    let latestTokens = estimateTokens(latestMsg.content);

    // Truncate if too large
    if (latestTokens > MAX_TOKENS * 0.8) { // Reserve 80% for user message max
      const keepChars = Math.floor(MAX_TOKENS * 0.8 * ESTIMATED_CHARS_PER_TOKEN);
      latestMsg.content = latestMsg.content.substring(0, keepChars) + "\n\n[Content truncated due to length]";
      latestTokens = Math.floor(MAX_TOKENS * 0.8);
    }

    currentTokens += latestTokens;

    // 3. Add history in reverse order (most recent first)
    const historyMessages = [];
    for (let i = finalMessages.length - 2; i >= 1; i--) {
      const msg = finalMessages[i];
      const msgTokens = estimateTokens(msg.content);

      if (currentTokens + msgTokens < MAX_TOKENS) {
        historyMessages.unshift(msg);
        currentTokens += msgTokens;
      } else {
        break;
      }
    }

    // Assemble final array: [system, ...history, latest]
    optimizedMessages.push(...historyMessages, latestMsg);

    // Parallel execution: Start AI call and DB operations simultaneously
    const aiPromise = groqChat({
      messages: optimizedMessages,
      model: model || FAST_MODELS.DEFAULT, // FIX: Use proper chat model
      temperature: temperature !== undefined ? temperature : 0.7,
      maxTokens: maxTokens || 2000,
      userId: userId || "anonymous",
    });

    // Start DB user sync in parallel (if logged in)
    let dbUserPromise = null;
    if (userId) {
      dbUserPromise = ensureUserExists(userId, clerkUser);
    }

    // Wait for AI response (priority)
    const aiResponse = await aiPromise;
    
    // Extract reply from new response format
    const reply = typeof aiResponse === 'string' ? aiResponse : aiResponse.content;

    // Validate response
    if (!reply || typeof reply !== 'string') {
      throw new Error("Invalid response from AI service");
    }

    // --- Database Persistence (non-blocking for response) ---
    let savedChatId = chatId;
    let newTitle = null;

    if (userId && dbUserPromise) {
      try {
        const dbUser = await dbUserPromise;
        
        if (dbUser) {
          const lastUserMessage = messages[messages.length - 1].content;

          if (!savedChatId) {
            // Generate title quickly (parallel with save)
            const titlePromise = generateChatTitle(lastUserMessage);
            
            // Create chat immediately with placeholder
            const newChat = await prisma.chat.create({
              data: {
                userId: userId,
                title: "New Chat", // Temporary
              }
            });
            savedChatId = newChat.id;

            // Update with generated title
            titlePromise.then(async (generatedTitle) => {
              try {
                await prisma.chat.update({
                  where: { id: savedChatId },
                  data: { title: generatedTitle }
                });
                newTitle = generatedTitle;
              } catch (e) {
                console.warn("Failed to update chat title", e);
              }
            });
            
            newTitle = "New Chat"; // Return immediately
          } else {
            // Verify ownership and update
            const existingChat = await prisma.chat.findUnique({ 
              where: { id: savedChatId },
              select: { userId: true }
            });
            
            if (existingChat && existingChat.userId === userId) {
              // Non-blocking update
              prisma.chat.update({
                where: { id: savedChatId },
                data: { updatedAt: new Date() }
              }).catch(e => console.warn("Failed to update chat timestamp", e));
            } else {
              savedChatId = null;
            }
          }

          // Save messages (non-blocking batch)
          if (savedChatId) {
            saveMessages(savedChatId, lastUserMessage, reply).catch(e => 
              console.warn("Failed to save messages", e)
            );
          }
        }
      } catch (dbError) {
        console.warn("Database operation failed, but returning AI response:", dbError);
      }
    }

    return Response.json({
      reply,
      messageCount: optimizedMessages.length,
      chatId: savedChatId,
      title: newTitle,
      usage: typeof aiResponse === 'object' ? aiResponse.usage : undefined
    });

  } catch (error) {
    console.error("Chat API error:", error.message);

    // Determine error type and return appropriate response
    if (error.message.includes("Rate limited")) {
      return Response.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    if (error.message.includes("Groq")) {
      return Response.json(
        { error: "AI service temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }

    if (error.message.includes("timeout")) {
      return Response.json(
        { error: "Request timeout. Please try again with a shorter message." },
        { status: 504 }
      );
    }

    return Response.json(
      {
        error: "An unexpected error occurred. Please try again.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Helper: Ensure user exists in database
async function ensureUserExists(userId, clerkUser) {
  try {
    let dbUser = await prisma.user.findUnique({ 
      where: { clerkId: userId },
      select: { id: true, clerkId: true }
    });

    if (!dbUser && clerkUser) {
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      if (email) {
        dbUser = await prisma.user.create({
          data: {
            clerkId: userId,
            email: email,
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
            avatarUrl: clerkUser.imageUrl,
          },
          select: { id: true, clerkId: true }
        });
      }
    }

    return dbUser;
  } catch (error) {
    console.error("Failed to sync user:", error);
    return null;
  }
}

// Helper: Generate chat title (optimized)
async function generateChatTitle(firstMessage) {
  try {
    const truncatedMsg = firstMessage.substring(0, 100);
    const titleResponse = await groqChat({
      messages: [{
        role: "user",
        content: `Generate a 3-5 word title for: "${truncatedMsg}". Title only, no quotes.`
      }],
      model: FAST_MODELS.SPITFIRE, // Use fastest model for titles
      temperature: 0.5,
      maxTokens: 20
    });
    
    const content = typeof titleResponse === 'string' ? titleResponse : titleResponse.content;
    return content.trim().replace(/^["']|["']$/g, '').substring(0, 50);
  } catch (e) {
    console.warn("Failed to generate title", e);
    return "New Chat";
  }
}

// Helper: Save messages in batch
async function saveMessages(chatId, userMessage, assistantMessage) {
  return prisma.message.createMany({
    data: [
      {
        chatId: chatId,
        role: "user",
        content: userMessage
      },
      {
        chatId: chatId,
        role: "assistant",
        content: assistantMessage
      }
    ]
  });
}