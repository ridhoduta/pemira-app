import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { candidateId, nim } = await req.json();

    if (!candidateId || !nim) {
      return NextResponse.json(
        { error: "Candidate ID and NIM are required" },
        { status: 400 }
      );
    }

    // Check if NIM has already voted
    const existingVote = await prisma.vote.findUnique({
      where: { nim },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "NIM has already voted" },
        { status: 400 }
      );
    }

    // Register the vote
    const vote = await prisma.vote.create({
      data: {
        nim,
        candidateId: parseInt(candidateId.toString()),
      },
    });

    return NextResponse.json(vote, { status: 201 });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
