import { auth } from "@clerk/nextjs/server";
import { openRouterChat } from "@/lib/openrouter";

export async function POST(req) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    if (!userId) {
      return Response.json(
        { error: "Unauthorized. Please sign in to continue." }, 
        { status: 401 }
      );
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

    const { messages } = body;

    // Validate messages
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
      if (!['user', 'assistant', 'system'].includes(msg.role)) {
        return Response.json(
          { error: "Message role must be 'user', 'assistant', or 'system'" }, 
          { status: 400 }
        );
      }
    }

    // Optional: Limit message history to prevent token overflow
    const MAX_MESSAGES = 50;
    const trimmedMessages = messages.slice(-MAX_MESSAGES);

    // Call AI service
    const reply = await openRouterChat({ 
      messages: trimmedMessages,
      userId // Pass userId for potential logging/tracking
    });

    // Validate response
    if (!reply || typeof reply !== 'string') {
      throw new Error("Invalid response from AI service");
    }

    return Response.json({ 
      reply,
      messageCount: trimmedMessages.length 
    });

  } catch (error) {
    console.error("Chat API error:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Determine error type and return appropriate response
    if (error.message.includes("Rate limited")) {
      return Response.json(
        { error: "Too many requests. Please wait a moment and try again." }, 
        { status: 429 }
      );
    }

    if (error.message.includes("OpenRouter error")) {
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

    // Generic error response
    return Response.json(
      { 
        error: "An unexpected error occurred. Please try again.", 
        details: process.env.NODE_ENV === 'development' ? error.message : undefined 
      }, 
      { status: 500 }
    );
  }
}