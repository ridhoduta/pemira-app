import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, vision, mission, image } = await req.json();

    if (!name || !vision || !mission) {
      return NextResponse.json(
        { error: "Name, Vision, and Mission are required" },
        { status: 400 }
      );
    }

    const candidate = await prisma.candidate.create({
      data: {
        name,
        vision,
        mission,
        image,
      },
    });

    return NextResponse.json(candidate, { status: 201 });
  } catch (error) {
    console.error("Error creating candidate:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        _count: {
          select: { votes: true },
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    return NextResponse.json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
