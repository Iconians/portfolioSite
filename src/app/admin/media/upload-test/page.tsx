import { MediaUploadTestForm } from "@/components/Admin/media/MediaUploadTestForm";

export default function MediaUploadTestPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Media Upload Test</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Dev-only verification for Phase 2. Uploads use the configured storage
        provider and create a MediaAsset row.
      </p>
      <MediaUploadTestForm />
    </div>
  );
}
