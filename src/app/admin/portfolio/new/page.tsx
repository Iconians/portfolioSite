import Link from "next/link";

import { PageHeader } from "@/components/Admin/layout/PageHeader";
import { CreateProjectForm } from "@/components/Admin/portfolio/CreateProjectForm";
import { ProjectEditor } from "@/components/Admin/portfolio/ProjectEditor";
import { Button } from "@/components/ui/button";
import { getProjectWriteSource } from "@/lib/project-write/config";

export default function NewPortfolioPage() {
  const writeSource = getProjectWriteSource();

  if (writeSource === "platform-api") {
    return (
      <div>
        <PageHeader
          title="Create Project"
          description="Create a draft case study on Platform, then complete content in the editor."
          breadcrumbs={[
            { label: "Portfolio", href: "/admin/portfolio" },
            { label: "Create" },
          ]}
          actions={
            <Link href="/admin/portfolio">
              <Button variant="outline">Back to portfolio</Button>
            </Link>
          }
        />
        <CreateProjectForm />
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
