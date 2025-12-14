const OPENROUTER_URL = process.env.OPENROUTER_BASE_URL;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

// Validate environment variables
if (!OPENROUTER_KEY) {
  throw new Error("OPENROUTER_API_KEY is missing in environment variables");
}

if (!OPENROUTER_URL) {
  throw new Error("OPENROUTER_BASE_URL is missing in environment variables");
}

// Configuration constants
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 1000; // 1 second
const REQUEST_TIMEOUT = 30000; // 30 seconds

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
        const waitTime = BASE_RETRY_DELAY * Math.pow(2, retries);
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

    // Handle timeout
    if (error.name === 'AbortError') {
      throw new Error("Request timeout: The AI service took too long to respond.");
    }

    // Retry on network errors
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
 * Main function to chat with OpenRouter API
 */
export async function openRouterChat({
  messages,
  model = "deepseek/deepseek-chat-v3:free",
  temperature = 0.7,
  maxTokens = 2000,
  userId = null,
  transforms = null,
}) {
  // Validate inputs
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error("Messages array is required and cannot be empty");
  }

  // Ensure system message for better responses
  const systemMessage = {
    role: "system",
    content: "You are a helpful, knowledgeable, and friendly AI assistant. Provide clear, accurate, and well-formatted responses. Use markdown formatting when appropriate for better readability."
  };

  // Check if there's already a system message
  const hasSystemMessage = messages.some(msg => msg.role === "system");
  const finalMessages = hasSystemMessage ? messages : [systemMessage, ...messages];

  try {
    const url = `${OPENROUTER_URL}/chat/completions`;
    console.log("Calling OpenRouter API:", {
      url,
      model,
      messageCount: finalMessages.length,
      userId: userId || "anonymous",
      timestamp: new Date().toISOString()
    });

    const res = await fetchWithRetry(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "MicroLearn AI Chat",
      },
      body: JSON.stringify({
        model,
        messages: finalMessages,
        temperature,
        max_tokens: maxTokens,
        transforms: transforms,
        // Optional: Add streaming for better UX in future
        // stream: false,
      }),
    });

    // Handle non-OK responses
    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage;

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorJson.message || errorText;
      } catch {
        errorMessage = errorText;
      }

      console.error("OpenRouter error response:", {
        status: res.status,
        statusText: res.statusText,
        error: errorMessage
      });

      // Handle specific error cases
      if (res.status === 401) {
        throw new Error("OpenRouter API authentication failed. Please check your API key.");
      }
      if (res.status === 402) {
        throw new Error("OpenRouter API: Insufficient credits. Please check your account.");
      }
      if (res.status === 400) {
        throw new Error(`OpenRouter API: Invalid request - ${errorMessage}`);
      }

      throw new Error(`OpenRouter error: ${res.status} - ${errorMessage}`);
    }

    // Parse response
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      console.error("No content in response:", data);
      throw new Error("No response content from OpenRouter");
    }

    // Log successful response (optional, useful for monitoring)
    console.log("OpenRouter response received:", {
      model: data.model,
      tokens: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      timestamp: new Date().toISOString()
    });

    return reply.trim();

  } catch (error) {
    console.error("OpenRouterChat error:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

/**
 * Optional: Function to validate API connection
 */
export async function validateOpenRouterConnection() {
  try {
    await openRouterChat({
      messages: [{ role: "user", content: "Hi" }],
      maxTokens: 10,
    });
    return { success: true, message: "OpenRouter connection successful" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}