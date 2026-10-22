import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { formatDate, readingTime } from "@/lib/utils";

type Blog = {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: Date | string;
  content: string;
  category: { name: string };
};

export default function BlogCard({ blog, featured = false }: { blog: Blog; featured?: boolean }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="group block">
      <div className={`relative overflow-hidden bg-charcoal-2 ${featured ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
        <Image
          src={blog.featuredImage}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
        />
        <div className="absolute left-5 top-5">
          <span className="border border-ivory/30 bg-black/40 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-ivory backdrop-blur-sm">
            {blog.category.name}
          </span>
        </div>
      </div>
      <div className="mt-5">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.15em] text-charcoal-2/60">
          <span>{formatDate(blog.publishedAt)}</span>
          <span className="h-1 w-1 rounded-full bg-charcoal-2/40" />
          <span>{readingTime(blog.content)}</span>
        </div>
        <h3 className="mt-3 font-display text-2xl leading-snug text-charcoal-1 transition-colors duration-300 group-hover:text-gold">
          {blog.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-charcoal-2/70">{blog.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-charcoal-1">
          Read Article
          <ArrowUpRight className="h-3.5 w-3.5 text-gold transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </Link>
  );
}
