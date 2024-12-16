import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Extract page number from query parameters (default to 1 if not provided)
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const itemsPerPage = 10;
    const skip = (page - 1) * itemsPerPage;

    // Fetch messages with pagination and order by date descending
    const messages = await prisma.adminMessage.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: itemsPerPage,
    });

    // Get the total count of messages for calculating the number of pages
    const totalMessages = await prisma.adminMessage.count();

    return NextResponse.json({ messages, totalMessages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    const newMessage = await prisma.adminMessage.create({
      data: {
        m_title: title,
        m_content: content,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 });
  }
}

