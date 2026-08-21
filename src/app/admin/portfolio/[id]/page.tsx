import { getPortfolioItemById } from "@/lib/data/portfolio";
import { notFound } from "next/navigation";
import { PortfolioForm } from "@/components/Admin/PortfolioForm";
import { PageHeader } from "@/components/Admin/layout/PageHeader";

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getPortfolioItemById(id);

  if (!item) {
    notFound();
  }

  const formData: Parameters<typeof PortfolioForm>[0]["initialData"] = {
    img: item.img,
    caption: item.caption,
    description: item.description,
    category: item.category,
    url: item.url ?? undefined,
    github: item.github ?? undefined,
    keyFeatures: item.keyFeatures ?? undefined,
    role: item.role ?? undefined,
    highlights: item.highlights ?? undefined,
    projectType: (item.projectType ?? undefined) as
      | ""
      | "saas"
      | "client"
      | "engineering"
      | "personal"
      | undefined,
  };

  return (
    <div>
      <PageHeader
        title="Edit Project"
        description="Update portfolio project details and hero image."
        breadcrumbs={[
          { label: "Portfolio", href: "/admin/portfolio" },
          { label: "Edit" },
          { label: item.caption },
        ]}
      />
      <PortfolioForm initialData={formData} portfolioId={item.id} />
    </div>
  );
}
