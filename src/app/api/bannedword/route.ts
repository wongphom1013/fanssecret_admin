import { NextResponse } from "next/server";
import  prisma from "@/lib/prisma"; // Adjust this import based on your Prisma client setup

// GET request to fetch all banned words
export async function GET() {
  try {
    const bannedWords = await prisma.bannedWord.findMany({
      orderBy: {
        createdAt: 'desc', // Optional: Sort the banned words by the creation date
      },
    });

    return NextResponse.json(bannedWords);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banned words" }, { status: 500 });
  }
}


//// POST request to add a banned word
export async function POST(request: Request) {
  try {
    const { word } = await request.json(); // Extract the word from the request body

    if (!word) {
      return NextResponse.json(
        { error: "Word is required" },
        { status: 400 }
      );
    }

    // Insert the new banned word into the Prisma table
    const newBannedWord = await prisma.bannedWord.create({
      data: {
        word: word,
        banned_state: false, // Set to true as default banned state

      },
    });

    return NextResponse.json(newBannedWord, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add banned word" },
      { status: 500 }
    );
  }
}
