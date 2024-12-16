
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Handle PUT request to update a message
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { title, content } = await req.json();
  
    try {
      const updatedMessage = await prisma.adminMessage.update({
        where: { id: parseInt(id) },
        data: { m_title: title, m_content: content, createdAt: new Date() },
      });
      return NextResponse.json(updatedMessage);
    } catch (error) {
      return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
    }
  }
  
// Handle DELETE request to remove a message
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
  
    try {
      await prisma.adminMessage.delete({
        where: { id: parseInt(id) },
      });
      return NextResponse.json({ message: "Message removed" });
    } catch (error) {
      return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
    }
  }
  
  