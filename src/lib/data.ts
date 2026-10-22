import { prisma } from "@/lib/prisma";

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (settings) return settings;
  return prisma.siteSettings.create({ data: { id: "singleton" } });
}

export async function getProjectCategories() {
  return prisma.category.findMany({
    where: { type: "PROJECT" },
    orderBy: { order: "asc" },
  });
}

export async function getBlogCategories() {
  return prisma.category.findMany({
    where: { type: "BLOG" },
    orderBy: { order: "asc" },
  });
}

export async function getProjects(opts?: { category?: string; featured?: boolean; limit?: number }) {
  return prisma.project.findMany({
    where: {
      published: true,
      ...(opts?.featured !== undefined ? { featured: opts.featured } : {}),
      ...(opts?.category && opts.category !== "all"
        ? { category: { slug: opts.category } }
        : {}),
    },
    include: { category: true },
    orderBy: { order: "asc" },
    take: opts?.limit,
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug, published: true },
    include: {
      category: true,
      gallery: { orderBy: { order: "asc" } },
    },
  });
}

export async function getAdjacentProjects(order: number) {
  const [prev, next] = await Promise.all([
    prisma.project.findFirst({
      where: { published: true, order: { lt: order } },
      orderBy: { order: "desc" },
    }),
    prisma.project.findFirst({
      where: { published: true, order: { gt: order } },
      orderBy: { order: "asc" },
    }),
  ]);
  return { prev, next };
}

export async function getBlogs(opts?: { category?: string; page?: number; pageSize?: number }) {
  const pageSize = opts?.pageSize ?? 6;
  const page = opts?.page ?? 1;
  const where = {
    published: true,
    ...(opts?.category && opts.category !== "all"
      ? { category: { slug: opts.category } }
      : {}),
  };
  const [items, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.blog.count({ where }),
  ]);
  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getLatestBlogs(limit = 3) {
  return prisma.blog.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getBlogBySlug(slug: string) {
  return prisma.blog.findUnique({
    where: { slug, published: true },
    include: { category: true },
  });
}

export async function getRelatedBlogs(categoryId: string, excludeSlug: string, limit = 3) {
  return prisma.blog.findMany({
    where: { published: true, categoryId, slug: { not: excludeSlug } },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getAdjacentBlog(publishedAt: Date) {
  const [prev, next] = await Promise.all([
    prisma.blog.findFirst({
      where: { published: true, publishedAt: { lt: publishedAt } },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.blog.findFirst({
      where: { published: true, publishedAt: { gt: publishedAt } },
      orderBy: { publishedAt: "asc" },
    }),
  ]);
  return { prev, next };
}

export async function getServices() {
  return prisma.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
}

export async function getServiceBySlug(slug: string) {
  return prisma.service.findUnique({ where: { slug, published: true } });
}

export async function getTestimonials() {
  return prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
}

export async function getDashboardStats() {
  const [totalProjects, featuredProjects, totalBlogs, publishedBlogs, categories, enquiries, unreadEnquiries] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { featured: true } }),
      prisma.blog.count(),
      prisma.blog.count({ where: { published: true } }),
      prisma.category.count(),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { read: false } }),
    ]);
  return { totalProjects, featuredProjects, totalBlogs, publishedBlogs, categories, enquiries, unreadEnquiries };
}
