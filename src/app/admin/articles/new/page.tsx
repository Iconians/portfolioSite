import { ArticleEditor } from "@/app/Components/Admin/ArticleEditor";

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Create New Article</h1>
      <ArticleEditor />
    </div>
  );
}
