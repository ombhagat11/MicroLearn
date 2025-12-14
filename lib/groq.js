const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Validate environment variables
if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing in environment variables");
}

// Configuration constants
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 1000;
const REQUEST_TIMEOUT = 30000;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Default models optimized for speed
const FAST_MODELS = {
  DEFAULT: "llama-3.3-70b-versatile", // Fast and capable
  SPITFIRE: "llama-3.3-70b-spitfire", // Ultra-fast responses
  REASONING: "deepseek-r1-distill-llama-70b", // For complex tasks
};

/**
 * Fetch with retry logic and exponential backoff
 */
async function fetchWithRetry(url, options, retries = 0) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle rate limiting (429)
    if (res.status === 429) {
      if (retries < MAX_RETRIES) {
        const retryAfter = res.headers.get('retry-after');
        const waitTime = retryAfter 
          ? parseInt(retryAfter) * 1000 
          : BASE_RETRY_DELAY * Math.pow(2, retries);
        
        console.warn(`Rate limited. Retrying in ${waitTime}ms (attempt ${retries + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return fetchWithRetry(url, options, retries + 1);
      }
      throw new Error("Rate limited: Maximum retries exceeded. Please try again in a few moments.");
    }

    // Handle server errors (5xx) with retry
    if (res.status >= 500 && res.status < 600) {
      if (retries < MAX_RETRIES) {
        const waitTime = BASE_RETRY_DELAY * Math.pow(2, retries);
        console.warn(`Server error ${res.status}. Retrying in ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return fetchWithRetry(url, options, retries + 1);
      }
      throw new Error(`Server error: ${res.status}. Please try again later.`);
    }

    return res;

  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error("Request timeout: The AI service took too long to respond.");
    }

    if (retries < MAX_RETRIES && (error.message.includes("fetch") || error.message.includes("network"))) {
      const waitTime = BASE_RETRY_DELAY * Math.pow(2, retries);
      console.warn(`Network error. Retrying in ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return fetchWithRetry(url, options, retries + 1);
    }

    throw error;
  }
}

/**
 * Optimized chat function with streaming support and better defaults
 */
export async function groqChat({
  messages,
  model = FAST_MODELS.DEFAULT,
  temperature = 0.7,
  maxTokens = 2000,
  userId = null,
  stream = false,
  topP = 1,
  stop = null,
}) {
  // Validate inputs
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error("Messages array is required and cannot be empty");
  }

  // Optimized system message
  const systemMessage = {
    role: "system",
    content: "You are a helpful AI assistant. Provide clear, concise responses."
  };

  const hasSystemMessage = messages.some(msg => msg.role === "system");
  const finalMessages = hasSystemMessage ? messages : [systemMessage, ...messages];

  // Optimize message content - remove excessive whitespace
  const optimizedMessages = finalMessages.map(msg => ({
    ...msg,
    content: typeof msg.content === 'string' 
      ? msg.content.trim().replace(/\s+/g, ' ')
      : msg.content
  }));

  try {
    const requestBody = {
      model,
      messages: optimizedMessages,
      temperature,
      max_tokens: maxTokens,
      top_p: topP,
      stream,
    };

    // Add stop sequences if provided
    if (stop) {
      requestBody.stop = stop;
    }

    const res = await fetchWithRetry(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorJson.message || errorText;
      } catch {
        errorMessage = errorText;
      }

      if (res.status === 401) {
        throw new Error("Groq API authentication failed. Please check your API key.");
      }
      if (res.status === 429) {
        throw new Error("Groq API: Rate limit exceeded. Please try again later.");
      }
      if (res.status === 400) {
        throw new Error(`Groq API: Invalid request - ${errorMessage}`);
      }

      throw new Error(`Groq error: ${res.status} - ${errorMessage}`);
    }

    // Handle streaming response
    if (stream) {
      return res.body;
    }

    // Parse regular response
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("No response content from Groq");
    }

    return {
      content: reply.trim(),
      usage: data.usage,
      model: data.model,
      finishReason: data.choices?.[0]?.finish_reason,
    };

  } catch (error) {
    console.error("GroqChat error:", error.message);
    throw error;
  }
}

/**
 * Streaming chat with callback for real-time responses
 */
export async function groqChatStream({
  messages,
  model = FAST_MODELS.DEFAULT,
  temperature = 0.7,
  maxTokens = 2000,
  onToken = null,
  onComplete = null,
}) {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error("Messages array is required and cannot be empty");
  }

  const systemMessage = {
    role: "system",
    content: "You are a helpful AI assistant. Provide clear, concise responses."
  };

  const hasSystemMessage = messages.some(msg => msg.role === "system");
  const finalMessages = hasSystemMessage ? messages : [systemMessage, ...messages];

  const optimizedMessages = finalMessages.map(msg => ({
    ...msg,
    content: typeof msg.content === 'string' 
      ? msg.content.trim().replace(/\s+/g, ' ')
      : msg.content
  }));

  try {
    const res = await fetchWithRetry(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: optimizedMessages,
        temperature,
        max_tokens: maxTokens,
        stream: true,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Groq error: ${res.status} - ${errorText}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            
            if (content) {
              fullContent += content;
              if (onToken) {
                onToken(content);
              }
            }
          } catch (e) {
            // Skip invalid JSON chunks
          }
        }
      }
    }

    if (onComplete) {
      onComplete(fullContent);
    }

    return fullContent;

  } catch (error) {
    console.error("GroqChatStream error:", error.message);
    throw error;
  }
}

/**
 * Quick response function - optimized for speed
 */
export async function groqQuickChat(prompt, model = FAST_MODELS.SPITFIRE) {
  return groqChat({
    messages: [{ role: "user", content: prompt }],
    model,
    temperature: 0.5,
    maxTokens: 1000,
  });
}

/**
 * Batch multiple requests efficiently
 */
export async function groqBatchChat(prompts, options = {}) {
  const promises = prompts.map(prompt => 
    groqChat({
      messages: [{ role: "user", content: prompt }],
      ...options,
    })
  );
  
  return Promise.all(promises);
}

/**
 * Connection validator with faster timeout
 */
export async function validateGroqConnection() {
  try {
    await groqQuickChat("Hi", FAST_MODELS.SPITFIRE);
    return { success: true, message: "Groq connection successful" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Export fast models for external use
export { FAST_MODELS };