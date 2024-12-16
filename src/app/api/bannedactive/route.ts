import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from "next/server";
import prisma from '@/lib/prisma'; // Ensure Prisma is set up correctly

export async function POST(request: Request) {

    //const { ban_active } = request.body;
    const { ban_active } = await request.json();

    try {
      // Update the banned active state in the database
      const updatedBannedActive = await prisma.bannedActive.update({
        where: { id: 1 }, // Assuming there's only one record
        data: { ban_active: ban_active },
        // create: { ban_active },
      });
      return NextResponse.json(updatedBannedActive);
    } catch (error) {
      console.error('Error updating banned active state:', error);
      return NextResponse.json({ error: "Failed to fetch banned words" }, { status: 500 });
    }
  }
  

  export async function GET() {
    try {
      const bannedActive = await prisma.bannedActive.findMany();
  
      return NextResponse.json(bannedActive);
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch banned words" }, { status: 500 });
    }
  }

