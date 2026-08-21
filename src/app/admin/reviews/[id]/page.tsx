import { notFound } from "next/navigation";

import { PageHeader } from "@/components/Admin/layout/PageHeader";
import { ReviewForm } from "@/components/Admin/ReviewForm";
import { getReviewById } from "@/lib/data/reviews";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = await getReviewById(id);

  if (!review) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title="Edit Review"
        description="Update review content and star rating."
        breadcrumbs={[
          { label: "Reviews", href: "/admin/reviews" },
          { label: "Edit" },
          { label: review.title },
        ]}
      />
      <ReviewForm initialData={review} reviewId={review.id} />
    </div>
  );
}
