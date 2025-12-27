import { NextResponse } from "next/server";
import { getAllReviews } from "@/lib/data/reviews";

export async function GET() {
  try {
    const reviews = await getAllReviews();
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);

    // Return empty array instead of error to prevent frontend crashes
    // The frontend components handle empty arrays gracefully
    if (
      error instanceof Error &&
      error.message.includes("Can't reach database")
    ) {
      console.warn("Database connection failed, returning empty array");
      return NextResponse.json({ reviews: [] });
    }

    return NextResponse.json(
      { error: "Failed to fetch reviews", reviews: [] },
      { status: 500 }
    );
  }
}
