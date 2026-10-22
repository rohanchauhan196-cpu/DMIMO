import BlogForm from "@/components/admin/BlogForm";
import { getBlogCategories } from "@/lib/data";

export default async function NewBlogPage() {
  const categories = await getBlogCategories();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">New Blog Post</h1>
      <p className="mt-1 text-sm text-neutral-500">Write a new article for the journal.</p>
      <div className="mt-8 max-w-3xl">
        <BlogForm categories={categories} />
      </div>
    </div>
  );
}
