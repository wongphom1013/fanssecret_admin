import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure this path matches your prisma setup

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    console.log(email);
    // Find the user by email in the database
    const admin = await prisma.user.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json({ error: "Email not found" }, { status: 401 });
    }

    // Email exists in the database, proceed with login
    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
