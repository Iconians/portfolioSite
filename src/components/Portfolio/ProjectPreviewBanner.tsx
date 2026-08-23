import { AlertTriangleIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProjectPreviewBannerProps {
  publishStatus: string;
}

export function ProjectPreviewBanner({ publishStatus }: ProjectPreviewBannerProps) {
  return (
    <Alert variant="warning" role="status">
      <AlertTriangleIcon />
      <AlertDescription className="text-amber-100">
        Admin preview — this project is{" "}
        <span className="font-semibold">{publishStatus}</span> and not visible
        to the public.
      </AlertDescription>
    </Alert>
  );
}
