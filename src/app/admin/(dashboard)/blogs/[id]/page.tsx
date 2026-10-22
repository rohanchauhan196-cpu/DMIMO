import { notFound } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import { getBlogCategories } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [categories, blog] = await Promise.all([
    getBlogCategories(),
    prisma.blog.findUnique({ where: { id } }),
  ]);

  if (!blog) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Edit Blog Post</h1>
      <p className="mt-1 text-sm text-neutral-500">{blog.title}</p>
      <div className="mt-8 max-w-3xl">
        <BlogForm
          categories={categories}
          blogId={blog.id}
          initial={{
            title: blog.title,
            slug: blog.slug,
            categoryId: blog.categoryId,
            author: blog.author,
            featuredImage: blog.featuredImage,
            excerpt: blog.excerpt,
            content: blog.content,
            published: blog.published,
            publishedAt: blog.publishedAt.toISOString().slice(0, 10),
            seoTitle: blog.seoTitle ?? "",
            seoDescription: blog.seoDescription ?? "",
          }}
        />
      </div>
    </div>
  );
}
