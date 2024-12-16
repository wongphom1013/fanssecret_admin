import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Ensure Prisma is set up correctly

export async function GET(request: Request) {
  try {
    // Fetch all banned behaviors from the database
    const bannedBehaviors = await prisma.bannedBehavior.findMany({
      orderBy: {
        send_time: 'desc', // Optional: Sort the banned words by the creation date
      },
    });
    return NextResponse.json(bannedBehaviors);
  } catch (error) {
    console.error('Error fetching banned behaviors:', error);
    return NextResponse.json({ error: 'Failed to fetch banned behaviors' }, { status: 500 });
  }
}

