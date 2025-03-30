import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { hasInterest: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');
    
    if (!projectId) {
      return NextResponse.json(
        { hasInterest: false, message: "Project ID is required" },
        { status: 400 }
      );
    }

    // Check if user has already expressed interest
    const interest = await prisma.projectInterest.findUnique({
      where: {
        userId_projectId: {
          userId: session.user.id,
          projectId,
        },
      },
    });

    return NextResponse.json({
      hasInterest: !!interest,
    });
  } catch (error) {
    console.error("Error checking interest:", error);
    return NextResponse.json(
      { hasInterest: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
} 