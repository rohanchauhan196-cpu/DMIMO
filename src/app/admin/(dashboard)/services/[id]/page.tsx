import { notFound } from "next/navigation";
import ServiceForm from "@/components/admin/ServiceForm";
import { prisma } from "@/lib/prisma";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Edit Service</h1>
      <p className="mt-1 text-sm text-neutral-500">{service.title}</p>
      <div className="mt-8 max-w-3xl">
        <ServiceForm
          serviceId={service.id}
          initial={{
            title: service.title,
            slug: service.slug,
            number: service.number,
            shortDescription: service.shortDescription,
            description: service.description,
            image: service.image,
            capabilities: service.capabilities.join(", "),
            order: service.order,
            published: service.published,
          }}
        />
      </div>
    </div>
  );
}
