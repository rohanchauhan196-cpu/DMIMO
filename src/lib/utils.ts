import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...opts,
  }).format(d);
}

export function readingTime(html: string) {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export function excerptFromHtml(html: string, length = 160) {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > length ? `${text.slice(0, length).trim()}…` : text;
}

const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  slug: "Slug",
  categoryId: "Category",
  location: "Location",
  year: "Year",
  shortDescription: "Short Description",
  story: "Project Story",
  coverImage: "Cover Image",
  featuredImage: "Featured Image",
  image: "Image",
  excerpt: "Excerpt",
  content: "Content",
  author: "Author",
  number: "Number",
  description: "Description",
  gallery: "Gallery",
};

/** Turns an API error response into a readable message, listing each field that failed validation. */
export function formatApiError(json: unknown, fallback: string) {
  const body = (json ?? {}) as { error?: string; issues?: Record<string, string[] | undefined> };
  const issues = Object.entries(body.issues ?? {}).filter(([, msgs]) => msgs && msgs.length);
  if (issues.length) {
    return issues.map(([field, msgs]) => `${FIELD_LABELS[field] ?? field}: ${msgs![0]}`).join(" · ");
  }
  return body.error ?? fallback;
}
