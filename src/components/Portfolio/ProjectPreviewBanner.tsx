interface ProjectPreviewBannerProps {
  publishStatus: string;
}

export function ProjectPreviewBanner({ publishStatus }: ProjectPreviewBannerProps) {
  return (
    <div
      role="status"
      className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"
    >
      Admin preview — this project is{" "}
      <span className="font-semibold">{publishStatus}</span> and not visible to the public.
    </div>
  );
}
