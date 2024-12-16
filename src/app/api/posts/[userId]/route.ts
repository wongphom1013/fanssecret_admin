import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Ensure prisma client is set up correctly

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  console.log(userId);

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
          userId: userId 
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

