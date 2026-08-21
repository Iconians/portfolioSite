import { PortfolioForm } from "@/components/Admin/PortfolioForm";
import { PageHeader } from "@/components/Admin/layout/PageHeader";

export default function NewPortfolioPage() {
  return (
    <div>
      <PageHeader
        title="Create Project"
        description="Add a new portfolio project to the public site."
        breadcrumbs={[
          { label: "Portfolio", href: "/admin/portfolio" },
          { label: "Create" },
        ]}
      />
      <PortfolioForm />
    </div>
  );
}
