import SettingsForm from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/data";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Site Settings</h1>
      <p className="mt-1 text-sm text-neutral-500">Global content used across the public website.</p>

      <div className="mt-8 max-w-3xl">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
