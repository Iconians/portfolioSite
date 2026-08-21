import { ReviewForm } from "@/components/Admin/ReviewForm";
import { PageHeader } from "@/components/Admin/layout/PageHeader";

export default function NewReviewPage() {
  return (
    <div>
      <PageHeader
        title="Create Review"
        description="Add a new client testimonial."
        breadcrumbs={[
          { label: "Reviews", href: "/admin/reviews" },
          { label: "Create" },
        ]}
      />
      <ReviewForm />
    </div>
  );
}
