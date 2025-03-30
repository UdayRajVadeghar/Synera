import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get unique categories from the database
    const categories = await prisma.project.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    // Extract categories as string array
    const categoryList = categories.map((c: { category: string }) => c.category);

    return NextResponse.json({ categories: categoryList });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
} 