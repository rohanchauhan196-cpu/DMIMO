import ProjectForm from "@/components/admin/ProjectForm";
import { getProjectCategories } from "@/lib/data";

export default async function NewProjectPage() {
  const categories = await getProjectCategories();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">New Project</h1>
      <p className="mt-1 text-sm text-neutral-500">Add a new project to the portfolio.</p>
      <div className="mt-8 max-w-3xl">
        <ProjectForm categories={categories} />
      </div>
    </div>
  );
}
