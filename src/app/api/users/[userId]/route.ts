import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Handle DELETE request to remove a user
export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;
  
    try {
      await prisma.user.delete({
        where: { id:  userId},
      });
      return NextResponse.json({ message: "Message removed" });
    } catch (error) {
      return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
    }
  }

  // PATCH: Toggle isBlocked status for a user
export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
  try {
      const { userId } = params;

      const userStatus = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userId) {
          return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
      }

      const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { isBlocked: !userStatus.isBlocked },
      });

      return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
      console.error('Error updating user block status:', error);
      return NextResponse.json({ error: 'Failed to update user block status' }, { status: 500 });
  }
}