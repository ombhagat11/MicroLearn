import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
    try {
        const { userId } = await auth();
        const { chatId } = await params;

        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId,
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });

        if (!chat) {
            return Response.json({ error: "Chat not found" }, { status: 404 });
        }

        if (chat.userId !== userId) {
            return Response.json({ error: "Unauthorized" }, { status: 403 });
        }

        return Response.json(chat);
    } catch (error) {
        console.error("Error fetching chat details:", error);
        return Response.json(
            { error: "Failed to fetch chat details" },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        const { userId } = await auth();
        const { chatId } = await params;

        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
        });

        if (!chat) {
            return Response.json({ error: "Chat not found" }, { status: 404 });
        }

        if (chat.userId !== userId) {
            return Response.json({ error: "Unauthorized" }, { status: 403 });
        }

        await prisma.chat.delete({
            where: { id: chatId },
        });

        return Response.json({ success: true });
    } catch (error) {
        console.error("Error deleting chat:", error);
        return Response.json(
            { error: "Failed to delete chat" },
            { status: 500 }
        );
    }
}
