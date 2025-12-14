const OPENROUTER_URL = process.env.OPENROUTER_BASE_URL;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_KEY) {
  throw new Error("OPENROUTER_API_KEY is missing");
}

if (!OPENROUTER_URL) {
  throw new Error("OPENROUTER_BASE_URL is missing");
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function fetchWithRetry(url, options, retries = 0) {
  try {
    const res = await fetch(url, options);

    if (res.status === 429) {
      if (retries < MAX_RETRIES) {
        const waitTime = RETRY_DELAY * Math.pow(2, retries); // Exponential backoff
        console.warn(`Rate limited. Retrying in ${waitTime}ms (attempt ${retries + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return fetchWithRetry(url, options, retries + 1);
      } else {
        throw new Error("Rate limited: Maximum retries exceeded. Please try again in a few moments.");
      }
    }

    return res;
  } catch (error) {
    if (retries < MAX_RETRIES && error.message.includes("fetch")) {
      const waitTime = RETRY_DELAY * Math.pow(2, retries);
      console.warn(`Network error. Retrying in ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return fetchWithRetry(url, options, retries + 1);
    }
    throw error;
  }
}

export async function openRouterChat({
  messages,
  model = "meta-llama/llama-3.3-70b-instruct:free",
  temperature = 0.7,
}) {
  try {
    const url = `${OPENROUTER_URL}/chat/completions`;
    console.log("Calling OpenRouter API:", url);
    
    const res = await fetchWithRetry(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "MicroLearn App",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("OpenRouter error response:", res.status, error);
      throw new Error(`OpenRouter error: ${res.status} - ${error}`);
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content;
    
    if (!reply) {
      throw new Error("No response content from OpenRouter");
    }

    return reply;
  } catch (error) {
    console.error("OpenRouterChat error:", error.message);
    throw error;
  }
}
