import { getAllPortfolioItems } from "@/lib/data/portfolio";
import { notFound } from "next/navigation";
import { PortfolioForm } from "@/components/Admin/PortfolioForm";

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const portfolio = await getAllPortfolioItems();
  const item = portfolio.find((p) => p.id === id);

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
    projectType: (item.projectType ?? undefined) as "" | "saas" | "client" | "engineering" | "personal" | undefined,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Portfolio Item</h1>
      <PortfolioForm initialData={formData} portfolioId={item.id} />
    </div>
  );
}
