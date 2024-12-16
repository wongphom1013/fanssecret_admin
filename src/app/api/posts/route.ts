// import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Ensure prisma client is set up correctly

// export async function GET(request: Request ) {
 
//   try {
//     const posts = await prisma.post.findMany({
//       orderBy: { createdAt: 'desc' },
//     });
//     return NextResponse.json(posts);
//   } catch (error) {
//     console.error('Error fetching posts:', error);
//     return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Ensure prisma client is set up correctly
export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);

  try {
      const posts = await prisma.post.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
              createdAt: 'desc',
          },
      });
      const totalPosts = await prisma.post.count(); // Get total posts count
      const totalPages = Math.ceil(totalPosts / limit);

      return NextResponse.json({ posts, totalPages });
  } catch (error) {
      return NextResponse.error();
  }
}