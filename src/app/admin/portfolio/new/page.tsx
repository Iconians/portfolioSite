import { PageHeader } from "@/components/Admin/layout/PageHeader";
import { ProjectEditor } from "@/components/Admin/portfolio/ProjectEditor";

export default function NewPortfolioPage() {
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
      <ProjectEditor />
    </div>
  );
}
