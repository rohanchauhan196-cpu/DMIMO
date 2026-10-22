"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Building2,
  Newspaper,
  Tags,
  Images,
  Settings,
  Mail,
  LogOut,
  ExternalLink,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: Building2 },
  { href: "/admin/blogs", label: "Blog Posts", icon: Newspaper },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/enquiries", label: "Enquiries", icon: Mail },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export default function AdminShell({ children, userEmail }: { children: React.ReactNode; userEmail: string }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh bg-neutral-100 text-neutral-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-neutral-200 bg-white md:flex">
        <div className="flex items-center gap-3 border-b border-neutral-200 px-6 py-5">
          <Image src="/logo.png" alt="D Mimo" width={28} height={28} className="h-7 w-7" />
          <div>
            <p className="text-sm font-semibold tracking-wide">D Mimo Admin</p>
            <p className="text-xs text-neutral-400">Content Studio</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-neutral-200 p-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="mb-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
            View Website
          </a>
          <div className="flex items-center justify-between rounded-md bg-neutral-50 px-3 py-2">
            <p className="truncate text-xs text-neutral-500">{userEmail}</p>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              aria-label="Sign out"
              className="text-neutral-400 hover:text-neutral-900"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 md:pl-64">
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      </div>
    </div>
  );
}
