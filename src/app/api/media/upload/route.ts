import { type NextRequest, NextResponse } from "next/server";

import { mediaApiError } from "@/lib/media/api-errors";
import { uploadMedia } from "@/lib/media/media.service";
import { requireAdmin } from "@/lib/permissions";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await uploadMedia({
      buffer,
      filename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      createdBy: user.id,
    });

    return NextResponse.json({ success: true, asset });
  } catch (error) {
    return mediaApiError(error, "Upload failed");
  }
}
