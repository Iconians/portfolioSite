import { ArticleEditor } from "@/components/Admin/ArticleEditor";
import { PageHeader } from "@/components/Admin/layout/PageHeader";

export default function NewArticlePage() {
  return (
    <div>
      <PageHeader
        title="Create Article"
        description="Draft a new blog article for the public site."
        breadcrumbs={[
          { label: "Articles", href: "/admin/articles" },
          { label: "Create" },
        ]}
      />
      <ArticleEditor />
    </div>
  );
}
