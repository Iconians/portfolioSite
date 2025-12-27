import { getAllPortfolioItems } from "@/lib/data/portfolio";
import { notFound } from "next/navigation";
import { PortfolioForm } from "@/app/Components/Admin/PortfolioForm";

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

  // Convert null values to undefined to match CreatePortfolioInput type
  const formData = {
    ...item,
    url: item.url ?? undefined,
    github: item.github ?? undefined,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Portfolio Item</h1>
      <PortfolioForm initialData={formData} portfolioId={item.id} />
    </div>
  );
}
