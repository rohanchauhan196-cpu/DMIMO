import SectionLabel from "@/components/ui/SectionLabel";
import ArrowLink from "@/components/ui/ArrowLink";
import BlogCard from "@/components/ui/BlogCard";
import { getLatestBlogs } from "@/lib/data";

export default async function LatestBlogs() {
  const blogs = await getLatestBlogs(4);
  if (blogs.length === 0) return null;

  return (
    <section className="bg-ivory py-28 text-charcoal-1 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel light className="mb-6">
              The Journal
            </SectionLabel>
            <h2 className="font-display text-4xl font-light leading-tight sm:text-5xl md:text-6xl">
              Notes from the <span className="italic text-gold">Studio.</span>
            </h2>
          </div>
          <ArrowLink href="/blog" variant="dark">
            View All Articles
          </ArrowLink>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {blogs.map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
}
