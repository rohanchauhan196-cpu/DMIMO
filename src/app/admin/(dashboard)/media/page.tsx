"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Upload, Loader2, Trash2, Check, Copy } from "lucide-react";

type Asset = {
  id: string;
  url: string;
  filename: string;
  width: number | null;
  height: number | null;
  size: number | null;
  createdAt: string;
};

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/media");
    if (res.ok) {
      const json = await res.json();
      setAssets(json.data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const uploadFiles = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      await fetch("/api/admin/upload", { method: "POST", body: formData });
    }
    setUploading(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this file? It will be removed from storage.")) return;
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const copyUrl = (asset: Asset) => {
    navigator.clipboard?.writeText(window.location.origin + asset.url).catch(() => {});
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Media Library</h1>
          <p className="mt-1 text-sm text-neutral-500">Upload and manage images used across the website.</p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload Files
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {loading ? (
        <p className="mt-10 text-sm text-neutral-400">Loading…</p>
      ) : assets.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-neutral-300 bg-white py-20 text-center">
          <p className="text-sm text-neutral-400">No media uploaded yet.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((asset) => (
            <div key={asset.id} className="group overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <div className="relative aspect-square bg-neutral-100">
                <Image src={asset.url} alt={asset.filename} fill sizes="25vw" className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => copyUrl(asset)}
                    aria-label="Copy URL"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-700 hover:text-neutral-900"
                  >
                    {copiedId === asset.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => remove(asset.id)}
                    aria-label="Delete"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-700 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium text-neutral-700">{asset.filename}</p>
                <p className="mt-0.5 text-[11px] text-neutral-400">
                  {asset.width && asset.height ? `${asset.width}×${asset.height} · ` : ""}
                  {formatSize(asset.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
