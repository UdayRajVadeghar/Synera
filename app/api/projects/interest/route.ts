import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { projectId } = await request.json();
    
    if (!projectId) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Check if user already expressed interest
    const existingInterest = await prisma.projectInterest.findFirst({
      where: {
        projectId,
        userId: session.user.id,
      },
    });

    if (existingInterest) {
      return NextResponse.json(
        { message: "You have already expressed interest in this project" },
        { status: 400 }
      );
    }

    // Create new interest record
    await prisma.projectInterest.create({
      data: {
        project: { connect: { id: projectId } },
        user: { connect: { id: session.user.id } },
      },
    });

    return NextResponse.json({
      message: "Interest expressed successfully",
    });
  } catch (error) {
    console.error("Error expressing interest:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 