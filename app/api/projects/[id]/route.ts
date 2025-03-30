import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch a specific project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            githubUsername: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { message: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PUT: Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if project exists and belongs to the user
    const existingProject = await prisma.project.findUnique({
      where: {
        id: params.id,
      },
      select: {
        creatorId: true,
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (existingProject.creatorId !== session.user.id) {
      return NextResponse.json(
        { message: "You do not have permission to update this project" },
        { status: 403 }
      );
    }

    // Parse the request body
    const body = await request.json();
    
    // Update the project
    const updatedProject = await prisma.project.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        description: body.description,
        requirements: body.requirements,
        techStack: body.techStack,
        teamSize: body.teamSize,
        timeframe: body.timeframe,
        difficulty: body.difficulty,
        category: body.category,
        commitment: body.commitment,
        communication: body.communication,
        githubRequired: body.githubRequired,
      },
    });

    return NextResponse.json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { message: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if project exists and belongs to the user
    const existingProject = await prisma.project.findUnique({
      where: {
        id: params.id,
      },
      select: {
        creatorId: true,
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (existingProject.creatorId !== session.user.id) {
      return NextResponse.json(
        { message: "You do not have permission to delete this project" },
        { status: 403 }
      );
    }

    // Delete the project
    await prisma.project.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { message: "Failed to delete project" },
      { status: 500 }
    );
  }
} 