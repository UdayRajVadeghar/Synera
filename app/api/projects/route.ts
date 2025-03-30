import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'requirements', 'techStack', 'teamSize', 'timeframe', 'difficulty', 'category'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        requirements: body.requirements,
        techStack: body.techStack,
        teamSize: body.teamSize,
        timeframe: body.timeframe,
        difficulty: body.difficulty,
        category: body.category,
        commitment: body.commitment || '10-20',
        communication: body.communication || 'discord',
        githubRequired: body.githubRequired || false,
        creatorId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Project created successfully",
        project,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const title = searchParams.get('title');

    // Build filter object
    const filter: any = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (title) filter.title = { contains: title, mode: 'insensitive' };

    // Fetch projects with filter
    const projects = await prisma.project.findMany({
      where: filter,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ projects });

  } catch (error) {
    console.error("Projects fetch error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 