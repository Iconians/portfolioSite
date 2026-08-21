import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { mediaApiError } from "@/lib/media/api-errors";
import { createPresignedMediaUpload } from "@/lib/media/media.service";
import { requireAdmin } from "@/lib/permissions";
import { PresignMediaSchema } from "@/lib/types/media";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = PresignMediaSchema.parse(await req.json());
    const { domain, type, ...uploadInput } = body;
    const objectKey =
      domain && type ? { domain, type } : undefined;
    const result = await createPresignedMediaUpload({
      ...uploadInput,
      objectKey,
    });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }
    return mediaApiError(error, "Presign failed");
  }
}
