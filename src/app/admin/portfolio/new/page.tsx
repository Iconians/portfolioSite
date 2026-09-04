import Link from "next/link";

import { PageHeader } from "@/components/Admin/layout/PageHeader";
import { ProjectEditor } from "@/components/Admin/portfolio/ProjectEditor";
import { Button } from "@/components/ui/button";
import { getProjectWriteSource } from "@/lib/project-write/config";
import { PLATFORM_PROJECT_CREATE_UNAVAILABLE_MESSAGE } from "@/lib/project-write/platform-create-policy";

export default function NewPortfolioPage() {
  const writeSource = getProjectWriteSource();

  if (writeSource === "platform-api") {
    return (
      <div>
        <PageHeader
          title="Create Project"
          description="Add a new portfolio project with the sectioned editor."
          breadcrumbs={[
            { label: "Portfolio", href: "/admin/portfolio" },
            { label: "Create" },
          ]}
        />
        <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
          {PLATFORM_PROJECT_CREATE_UNAVAILABLE_MESSAGE}
        </div>
        <div className="mt-4">
          <Link href="/admin/portfolio">
            <Button variant="outline">Back to portfolio</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Create Project"
        description="Add a new portfolio project with the sectioned editor."
        breadcrumbs={[
          { label: "Portfolio", href: "/admin/portfolio" },
          { label: "Create" },
        ]}
      />
      <ProjectEditor writeSource={writeSource} />
    </div>
  );
}
