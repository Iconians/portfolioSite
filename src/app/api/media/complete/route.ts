import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { mediaApiError } from "@/lib/media/api-errors";
import { completePresignedMediaUpload } from "@/lib/media/media.service";
import { requireAdmin } from "@/lib/permissions";
import { CompleteMediaUploadSchema } from "@/lib/types/media";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = CompleteMediaUploadSchema.parse(await req.json());
    const asset = await completePresignedMediaUpload({
      ...body,
      createdBy: user.id,
    });
    return NextResponse.json({ success: true, asset });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }
    return mediaApiError(error, "Complete upload failed");
  }
}
