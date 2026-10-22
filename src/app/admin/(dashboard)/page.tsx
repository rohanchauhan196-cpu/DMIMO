import Link from "next/link";
import { Building2, Star, Newspaper, CheckCircle2, Tags, Mail, MailWarning } from "lucide-react";
import { getDashboardStats } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [stats, recentEnquiries] = await Promise.all([
    getDashboardStats(),
    prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const cards = [
    { label: "Total Projects", value: stats.totalProjects, icon: Building2, href: "/admin/projects" },
    { label: "Featured Projects", value: stats.featuredProjects, icon: Star, href: "/admin/projects" },
    { label: "Total Blog Posts", value: stats.totalBlogs, icon: Newspaper, href: "/admin/blogs" },
    { label: "Published Posts", value: stats.publishedBlogs, icon: CheckCircle2, href: "/admin/blogs" },
    { label: "Categories", value: stats.categories, icon: Tags, href: "/admin/categories" },
    { label: "Contact Enquiries", value: stats.enquiries, icon: Mail, href: "/admin/enquiries" },
    { label: "Unread Enquiries", value: stats.unreadEnquiries, icon: MailWarning, href: "/admin/enquiries" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-500">An overview of your studio website content.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-lg border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-sm"
          >
            <c.icon className="h-5 w-5 text-neutral-400" strokeWidth={1.75} />
            <p className="mt-4 text-2xl font-semibold text-neutral-900">{c.value}</p>
            <p className="mt-1 text-xs text-neutral-500">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="text-sm font-semibold text-neutral-900">Recent Enquiries</h2>
          <Link href="/admin/enquiries" className="text-xs font-medium text-neutral-500 hover:text-neutral-900">
            View all
          </Link>
        </div>
        {recentEnquiries.length === 0 ? (
          <p className="px-6 py-8 text-sm text-neutral-400">No enquiries yet.</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {recentEnquiries.map((e) => (
              <li key={e.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{e.name}</p>
                  <p className="text-xs text-neutral-500">{e.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-400">{formatDate(e.createdAt)}</p>
                  {!e.read && (
                    <span className="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-700">
                      New
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
