import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Handler for POST requests to create a new message
export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  try {
    // Fetch messages where the user is either the sender or the receiver
    const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId },
          ],
        },
        include: {
          sender: { select: { name: true, email: true } },
          receiver: { select: { name: true, email: true } },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

    return NextResponse.json(messages, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
