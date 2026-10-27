import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email"),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  projectType: z.string().trim().max(60).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  budgetRange: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please tell us a little more about your project").max(4000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  categoryId: z.string().min(1, "Please create and choose a category first"),
  location: z.string().trim().min(1, "Required").max(160),
  year: z.coerce.number().int().min(1900, "Enter a year between 1900 and 2100").max(2100, "Enter a year between 1900 and 2100"),
  client: z.string().trim().max(160).optional().or(z.literal("")),
  architect: z.string().trim().max(160).optional().or(z.literal("")),
  area: z.string().trim().max(80).optional().or(z.literal("")),
  status: z.enum(["COMPLETED", "ONGOING", "CONCEPT"]),
  shortDescription: z.string().trim().min(10, "Must be at least 10 characters").max(400, "Must be 400 characters or less"),
  story: z.string().trim().min(10, "Must be at least 10 characters"),
  coverImage: z.string().trim().min(1, "Please upload a cover image"),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
  seoTitle: z.string().trim().max(200).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(400).optional().or(z.literal("")),
  gallery: z
    .array(
      z.object({
        url: z.string().min(1),
        caption: z.string().optional().or(z.literal("")),
        layout: z.enum(["full", "half", "large", "small"]).default("half"),
      })
    )
    .default([]),
});

export const blogSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  categoryId: z.string().min(1),
  author: z.string().trim().min(1).max(120).default("D Mimo Architects"),
  featuredImage: z.string().trim().min(1, "Please upload a featured image"),
  excerpt: z.string().trim().min(10).max(400),
  content: z.string().trim().min(10),
  published: z.boolean().default(true),
  publishedAt: z.coerce.date().optional(),
  seoTitle: z.string().trim().max(200).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(400).optional().or(z.literal("")),
});

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(80),
  slug: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/),
  type: z.enum(["PROJECT", "BLOG"]),
  order: z.coerce.number().int().default(0),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/),
  number: z.string().trim().min(1).max(10),
  shortDescription: z.string().trim().min(10).max(300),
  description: z.string().trim().min(10),
  image: z.string().trim().min(1),
  capabilities: z.array(z.string()).default([]),
  order: z.coerce.number().int().default(0),
  published: z.boolean().default(true),
});

export const settingsSchema = z.object({
  logoUrl: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1),
  address: z.string().trim().min(1),
  mapEmbedUrl: z.string().trim().nullable().optional().or(z.literal("")),
  instagramUrl: z.string().trim().optional().or(z.literal("")),
  linkedinUrl: z.string().trim().optional().or(z.literal("")),
  pinterestUrl: z.string().trim().optional().or(z.literal("")),
  behanceUrl: z.string().trim().optional().or(z.literal("")),
  footerNote: z.string().trim().min(1),
  statProjects: z.string().trim().min(1),
  statYears: z.string().trim().min(1),
  statCities: z.string().trim().min(1),
  statAwards: z.string().trim().min(1),
  seoDefaultTitle: z.string().trim().min(1),
  seoDefaultDesc: z.string().trim().min(1),
});
