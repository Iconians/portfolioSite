import { notFound } from "next/navigation";
import { MediaUploadTestForm } from "@/components/Admin/media/MediaUploadTestForm";

export default function MediaUploadTestPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Media Upload Test</h1>
      <p className="text-sm text-muted-foreground mb-2">
        Development-only Phase 2 verification. Remove this route after Phase 3
        media library ships.
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        Requires admin login. Uploads use the configured storage provider and
        create a MediaAsset row.
      </p>
      <MediaUploadTestForm />
    </div>
  );
}
