import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import BlogCard from "@/components/ui/BlogCard";
import ShareButtons from "@/components/sections/ShareButtons";
import JsonLd from "@/components/JsonLd";
import { formatDate, readingTime } from "@/lib/utils";
import { getBlogBySlug, getRelatedBlogs, getAdjacentBlog, getBlogs } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { items } = await getBlogs({ pageSize: 100 });
  return items.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return {};
  return {
    title: blog.seoTitle ?? blog.title,
    description: blog.seoDescription ?? blog.excerpt,
    openGraph: {
      title: blog.seoTitle ?? blog.title,
      description: blog.seoDescription ?? blog.excerpt,
      images: [{ url: blog.featuredImage }],
      type: "article",
      publishedTime: blog.publishedAt.toISOString(),
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const [related, { prev, next }] = await Promise.all([
    getRelatedBlogs(blog.categoryId, blog.slug),
    getAdjacentBlog(blog.publishedAt),
  ]);

  const url = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/blog/${blog.slug}`;

  return (
    <article className="bg-ivory pb-28 pt-40 text-charcoal-1 md:pb-36 md:pt-48">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: blog.title,
          description: blog.excerpt,
          image: [blog.featuredImage],
          datePublished: blog.publishedAt.toISOString(),
          dateModified: blog.updatedAt.toISOString(),
          author: { "@type": "Organization", name: blog.author },
          mainEntityOfPage: url,
        }}
      />
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <SectionLabel light className="mb-8">
          {blog.category.name}
        </SectionLabel>
        <h1 className="font-display text-4xl font-light leading-[1.1] sm:text-5xl md:text-6xl">{blog.title}</h1>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-charcoal-1/10 py-6 text-sm text-charcoal-2/70">
          <span className="font-medium text-charcoal-1">{blog.author}</span>
          <span className="h-1 w-1 rounded-full bg-charcoal-2/40" />
          <span>{formatDate(blog.publishedAt)}</span>
          <span className="h-1 w-1 rounded-full bg-charcoal-2/40" />
          <span>{readingTime(blog.content)}</span>
        </div>
      </div>

      <div className="relative mx-auto mt-12 aspect-[16/9] max-w-6xl overflow-hidden px-6 md:px-10">
        <Image
          src={blog.featuredImage}
          alt={blog.title}
          fill
          priority
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="object-cover"
        />
      </div>

      <div className="mx-auto mt-16 max-w-4xl px-6 md:px-10">
        <div
          className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-light prose-headings:text-charcoal-1 prose-p:text-charcoal-2/85 prose-p:leading-relaxed prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-blockquote:border-gold prose-blockquote:font-display prose-blockquote:text-xl prose-blockquote:italic prose-blockquote:text-charcoal-1 prose-strong:text-charcoal-1 prose-img:rounded-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-charcoal-1/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs uppercase tracking-[0.2em] text-charcoal-2/60">Share this article</p>
          <ShareButtons title={blog.title} url={url} />
        </div>
      </div>

      {(prev || next) && (
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 px-6 sm:grid-cols-2 md:px-10">
          {prev ? (
            <Link href={`/blog/${prev.slug}`} className="group flex items-center gap-3 border border-charcoal-1/10 p-6 transition-colors hover:border-gold">
              <ArrowLeft className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:-translate-x-1" strokeWidth={1.5} />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-charcoal-2/50">Previous</p>
                <p className="mt-1 font-display text-lg">{prev.title}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link href={`/blog/${next.slug}`} className="group flex items-center justify-end gap-3 border border-charcoal-1/10 p-6 text-right transition-colors hover:border-gold">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-charcoal-2/50">Next</p>
                <p className="mt-1 font-display text-lg">{next.title}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          ) : (
            <div />
          )}
        </div>
      )}

      {related.length > 0 && (
        <div className="mx-auto mt-28 max-w-[1600px] px-6 md:px-10">
          <SectionLabel light className="mb-10">
            Related Articles
          </SectionLabel>
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((b) => (
              <BlogCard key={b.slug} blog={b} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
