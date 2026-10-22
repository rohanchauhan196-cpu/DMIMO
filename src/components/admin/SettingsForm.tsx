"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";

type Settings = {
  logoUrl: string;
  email: string;
  phone: string;
  address: string;
  mapEmbedUrl: string | null;
  instagramUrl: string;
  linkedinUrl: string;
  pinterestUrl: string;
  behanceUrl: string;
  footerNote: string;
  statProjects: string;
  statYears: string;
  statCities: string;
  statAwards: string;
  seoDefaultTitle: string;
  seoDefaultDesc: string;
};

const inputClass = "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export default function SettingsForm({ initial }: { initial: Settings }) {
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => setData((d) => ({ ...d, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, mapEmbedUrl: data.mapEmbedUrl ?? "" }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Could not save settings");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-neutral-900">Contact Information</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Email">
            <input className={inputClass} value={data.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Phone">
            <input className={inputClass} value={data.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="Address">
            <textarea className={inputClass} rows={2} value={data.address} onChange={(e) => set("address", e.target.value)} />
          </Field>
          <Field label="Google Maps Embed URL (optional)">
            <input className={inputClass} value={data.mapEmbedUrl ?? ""} onChange={(e) => set("mapEmbedUrl", e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-neutral-900">Social Links</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Instagram">
            <input className={inputClass} value={data.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} />
          </Field>
          <Field label="LinkedIn">
            <input className={inputClass} value={data.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} />
          </Field>
          <Field label="Pinterest">
            <input className={inputClass} value={data.pinterestUrl} onChange={(e) => set("pinterestUrl", e.target.value)} />
          </Field>
          <Field label="Behance">
            <input className={inputClass} value={data.behanceUrl} onChange={(e) => set("behanceUrl", e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-neutral-900">Homepage Statistics</h2>
        <p className="mb-4 text-xs text-neutral-400">
          Shown in the About section stat counters. Replace with your studio&apos;s real figures.
        </p>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          <Field label="Projects">
            <input className={inputClass} value={data.statProjects} onChange={(e) => set("statProjects", e.target.value)} />
          </Field>
          <Field label="Years">
            <input className={inputClass} value={data.statYears} onChange={(e) => set("statYears", e.target.value)} />
          </Field>
          <Field label="Cities">
            <input className={inputClass} value={data.statCities} onChange={(e) => set("statCities", e.target.value)} />
          </Field>
          <Field label="Awards">
            <input className={inputClass} value={data.statAwards} onChange={(e) => set("statAwards", e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-neutral-900">Footer &amp; SEO Defaults</h2>
        <div className="grid grid-cols-1 gap-5">
          <Field label="Footer Note">
            <textarea className={inputClass} rows={2} value={data.footerNote} onChange={(e) => set("footerNote", e.target.value)} />
          </Field>
          <Field label="Default SEO Title">
            <input className={inputClass} value={data.seoDefaultTitle} onChange={(e) => set("seoDefaultTitle", e.target.value)} />
          </Field>
          <Field label="Default SEO Description">
            <textarea className={inputClass} rows={2} value={data.seoDefaultDesc} onChange={(e) => set("seoDefaultDesc", e.target.value)} />
          </Field>
        </div>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
        {saved ? "Saved" : "Save Settings"}
      </button>
    </form>
  );
}
