import { listMediaAssets } from "@/lib/data/media";
import { MediaGrid } from "@/components/Admin/media/MediaGrid";
import { MediaLibraryUpload } from "@/components/Admin/media/MediaLibraryUpload";
import { PageHeader } from "@/components/Admin/layout/PageHeader";

export default async function MediaLibraryPage() {
  let assets: Awaited<ReturnType<typeof listMediaAssets>> = [];
  let errorMessage: string | null = null;

  try {
    assets = await listMediaAssets();
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Failed to load media library";
  }

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Manage uploaded images and metadata"
        actions={<MediaLibraryUpload />}
      />

      {errorMessage ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : (
        <MediaGrid assets={assets} />
      )}
    </div>
  );
}
