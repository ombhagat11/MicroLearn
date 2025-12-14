import { auth } from "@clerk/nextjs/server";
import { openRouterChat } from "@/lib/openrouter";

export async function POST(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { messages } = await req.json();

    const reply = await openRouterChat({ messages });

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "AI error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
