import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the import path to your Prisma client

// Fetch a specific banned word by ID (GET request)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const bannedWord = await prisma.bannedWord.findUnique({
      where: { id: Number(id) },
    });

    if (!bannedWord) {
      return NextResponse.json({ error: "Banned word not found" }, { status: 404 });
    }

    return NextResponse.json(bannedWord);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banned word" }, { status: 500 });
  }
}

// Toggle the banned_state of a banned word (PATCH request)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Find the current state of the word
    const bannedWord = await prisma.bannedWord.findUnique({
      where: { id: Number(id) },
    });

    if (!bannedWord) {
      return NextResponse.json({ error: "Banned word not found" }, { status: 404 });
    }

    // Toggle the banned_state
    const updatedBannedWord = await prisma.bannedWord.update({
      where: { id: Number(id) },
      data: { banned_state: !bannedWord.banned_state },
    });

    return NextResponse.json(updatedBannedWord);
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle banned state" }, { status: 500 });
  }
}

// Delete a banned word by ID (DELETE request)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
  
      const deletedWord = await prisma.bannedWord.delete({
        where: { id: Number(id) },
      });
  
      return NextResponse.json({ message: "Banned word deleted successfully", deletedWord });
    } catch (error) {
      console.error("Error deleting banned word:", error);
      return NextResponse.json({ error: "Failed to delete banned word" }, { status: 500 });
    }
  }
