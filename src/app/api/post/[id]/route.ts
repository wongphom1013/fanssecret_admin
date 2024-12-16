import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Ensure prisma client is set up correctly

// Example in your `route.ts` file for the PUT request
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { isChecked } = await req.json(); // Getting the new `isChecked` value from the request body
console.log("ischecked1:", isChecked);
  try {
      const updatedPost = await prisma.post.update({
          where: { id: params.id },
          data: { isChecked: !isChecked},
      });
      console.log("ischecked2:", isChecked);
      return new Response(JSON.stringify(updatedPost), { status: 200 });
  } catch (error) {
      return new Response('Error updating post', { status: 500 });
  }
}

// Handle DELETE request for removing a post
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Get the post ID from the URL params

  try {
      // Use Prisma to delete the post by ID
      const deletedPost = await prisma.post.delete({
          where: {
              id: id, // Assuming 'id' is the unique identifier in your Post model
          },
      });

      // If post is successfully deleted, return a success message
      return NextResponse.json({ message: 'Post removed successfully', post: deletedPost });
  } catch (error) {
      // Handle errors (e.g., if the post with the given ID does not exist)
      console.error('Error deleting post:', error);
      return NextResponse.json(
          { message: 'Failed to remove post', error: error.message },
          { status: 500 }
      );
  }
}
