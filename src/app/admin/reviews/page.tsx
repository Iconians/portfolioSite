import { getAllReviews } from "@/lib/data/reviews";
import Link from "next/link";
import { Button } from "@/app/Components/ui/button";
import { ReviewList } from "@/app/Components/Admin/ReviewList";

export default async function ReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Reviews</h1>
        <Link href="/admin/reviews/new">
          <Button>Create Review</Button>
        </Link>
      </div>

      <ReviewList reviews={reviews} />
    </div>
  );
}
