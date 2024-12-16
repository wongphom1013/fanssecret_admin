import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Define the handler for the GET request
export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany({});

    // Return the list of users as JSON
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
