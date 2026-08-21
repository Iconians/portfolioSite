import Link from "next/link";

import { PageHeader } from "@/components/Admin/layout/PageHeader";
import { ReviewList } from "@/components/Admin/ReviewList";
import { Button } from "@/components/ui/button";
import { getAllReviewsAdmin } from "@/lib/data/reviews";

export default async function ReviewsPage() {
  const reviews = await getAllReviewsAdmin();

  return (
    <div>
      <PageHeader
        title="Reviews"
        description="Manage client testimonials shown on the public site."
        actions={
          <Link href="/admin/reviews/new">
            <Button>Create Review</Button>
          </Link>
        }
      />

      <ReviewList reviews={reviews} />
    </div>
  );
}
