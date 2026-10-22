import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { getProjectCategories } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [categories, project] = await Promise.all([
    getProjectCategories(),
    prisma.project.findUnique({ where: { id }, include: { gallery: { orderBy: { order: "asc" } } } }),
  ]);

  if (!project) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Edit Project</h1>
      <p className="mt-1 text-sm text-neutral-500">{project.title}</p>
      <div className="mt-8 max-w-3xl">
        <ProjectForm
          categories={categories}
          projectId={project.id}
          initial={{
            title: project.title,
            slug: project.slug,
            categoryId: project.categoryId,
            location: project.location,
            year: project.year,
            client: project.client ?? "",
            architect: project.architect ?? "",
            area: project.area ?? "",
            status: project.status,
            shortDescription: project.shortDescription,
            story: project.story,
            coverImage: project.coverImage,
            featured: project.featured,
            published: project.published,
            order: project.order,
            seoTitle: project.seoTitle ?? "",
            seoDescription: project.seoDescription ?? "",
            gallery: project.gallery.map((g) => ({
              url: g.url,
              caption: g.caption ?? "",
              layout: g.layout as "full" | "half" | "large" | "small",
            })),
          }}
        />
      </div>
    </div>
  );
}
