import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface ProjectTitle {
  title: string;
}

interface ProjectTechStack {
  techStack: string[];
}

interface ProjectCategory {
  category: string;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Get project title suggestions
    const projects = await prisma.project.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        title: true
      },
      take: 5
    });

    // Get tech stack suggestions
    const techProjects = await prisma.project.findMany({
      where: {
        techStack: {
          hasSome: [query]
        }
      },
      select: {
        techStack: true
      },
      take: 5
    });

    // Flatten and deduplicate tech stack items
    const techStacks = Array.from(
      new Set(
        techProjects.flatMap((project: ProjectTechStack) => 
          project.techStack.filter((tech: string) => 
            tech.toLowerCase().includes(query.toLowerCase())
          )
        )
      )
    ).slice(0, 5);

    // Get category suggestions
    const categories = await prisma.project.findMany({
      where: {
        category: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        category: true
      },
      distinct: ['category'],
      take: 3
    });

    // Combine all suggestions
    const suggestions = {
      titles: projects.map((p: ProjectTitle) => p.title),
      techStacks: techStacks,
      categories: categories.map((c: ProjectCategory) => c.category)
    };

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
    return NextResponse.json(
      { message: "Failed to fetch search suggestions" },
      { status: 500 }
    );
  }
} 