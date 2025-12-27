import { getAllReviews } from "@/lib/data/reviews";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/app/Components/Admin/ReviewForm";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reviews = await getAllReviews();
  const review = reviews.find((r) => r.id === id);

  if (!review) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Review</h1>
      <ReviewForm initialData={review} reviewId={review.id} />
    </div>
  );
}
