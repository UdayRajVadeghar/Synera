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

    const { projectId, message } = await request.json();
    
    if (!projectId || !message) {
      return NextResponse.json(
        { message: "Project ID and message are required" },
        { status: 400 }
      );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Don't allow messaging your own project
    if (project.creatorId === session.user.id) {
      return NextResponse.json(
        { message: "You cannot message your own project" },
        { status: 400 }
      );
    }

    // Get user info
    const sender = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    if (!sender) {
      return NextResponse.json(
        { message: "Sender not found" },
        { status: 404 }
      );
    }

    // Store the message in the database
    // In a real app, you would likely have a Message model
    // For now, we'll create a ProjectMessage model using Prisma
    const projectMessage = await prisma.projectMessage.create({
      data: {
        content: message,
        projectId: projectId,
        senderId: session.user.id,
        recipientId: project.creatorId,
      },
    });

    // In a real application, you would also:
    // 1. Send an email notification
    // 2. Create a real-time notification
    // 3. Possibly integrate with the communication platform mentioned

    return NextResponse.json({
      message: "Message sent successfully. The team leader will contact you soon.",
      data: {
        messageId: projectMessage.id,
        projectTitle: project.title,
        recipientName: project.creator.email,
      }
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 