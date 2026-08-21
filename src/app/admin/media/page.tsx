import { listMediaAssets } from "@/lib/data/media";
import { MediaGrid } from "@/components/Admin/media/MediaGrid";
import { MediaLibraryUpload } from "@/components/Admin/media/MediaLibraryUpload";

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
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage uploaded images stored in object storage.
          </p>
        </div>
        <MediaLibraryUpload />
      </div>

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
