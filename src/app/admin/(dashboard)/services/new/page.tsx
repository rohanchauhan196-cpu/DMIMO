import ServiceForm from "@/components/admin/ServiceForm";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">New Service</h1>
      <p className="mt-1 text-sm text-neutral-500">Add a new service offering.</p>
      <div className="mt-8 max-w-3xl">
        <ServiceForm />
      </div>
    </div>
  );
}
