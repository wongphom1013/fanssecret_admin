import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("remote-addr") || "IP not found";
    return NextResponse.json({ ip }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch IP" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";

// export async function GET(req, { params }) {
//     const { id } = params;

//     // Mocked response: Replace this with actual logic to fetch user IP from your database
//     const mockIpData = {
//         id,
//         ip: "192.168.1.1", // Replace with actual IP logic
//     };

//     return NextResponse.json(mockIpData);
// }