import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const chats = await prisma.chat.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                updatedAt: "desc",
            },
            take: 50, // Limit to recent 50 chats for performance
        });

        return Response.json(chats);
    } catch (error) {
        console.error("Error fetching chats:", error);
        return Response.json(
            { error: "Failed to fetch chats" },
            { status: 500 }
        );
    }
}
