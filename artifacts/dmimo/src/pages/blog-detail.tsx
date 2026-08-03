import React from "react";
import { useRoute, Link } from "wouter";
import { useGetBlog, useListBlogs } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";

import proj4Img from "@/assets/images/project-4.png";

const getFallbackImage = () => proj4Img;

export default function BlogDetail() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const { data: blog, isLoading, isError } = useGetBlog(slug);
  const { data: recentBlogs } = useListBlogs({ status: "published" });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background flex-col gap-4 text-center">
        <h1 className="text-4xl font-light">Article Not Found</h1>
        <Link href="/blog" className="text-primary hover:underline uppercase tracking-widest text-xs">
          Back to Journal
        </Link>
      </div>
    );
  }

  const otherBlogs = recentBlogs?.filter(b => b.id !== blog.id).slice(0, 2);

  return (
    <div className="bg-background min-h-[100dvh] text-foreground">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-end pb-20">
        <div className="absolute inset-0 z-0">
          <img
            src={blog.coverImage || getFallbackImage()}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center text-xs uppercase tracking-widest text-primary hover:text-primary/80 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-primary uppercase tracking-widest">
              <span className="border border-primary/30 px-3 py-1 bg-background/50 backdrop-blur-sm">
                {blog.category || "Insight"}
              </span>
              <span className="text-white/70 flex items-center">
                <Clock className="w-3 h-3 mr-1" /> {blog.readTime || 5} min read
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-light mb-6 leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-light">
              {blog.author && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-primary" /> {blog.author}
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-primary" /> 
                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          {blog.excerpt && (
            <p className="text-xl md:text-2xl text-foreground font-light leading-relaxed mb-16 border-l-2 border-primary pl-6 py-2">
              {blog.excerpt}
            </p>
          )}

          <div className="prose prose-invert prose-lg md:prose-xl font-light text-muted-foreground max-w-none prose-a:text-primary hover:prose-a:text-primary/80 prose-headings:font-light prose-headings:text-foreground prose-img:rounded-none">
            {blog.content ? (
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            ) : (
              <p>Content is being updated.</p>
            )}
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border flex flex-wrap gap-2">
              {blog.tags.map(tag => (
                <span key={tag} className="text-xs uppercase tracking-widest bg-secondary/50 px-3 py-1 text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Blogs */}
      {otherBlogs && otherBlogs.length > 0 && (
        <section className="py-20 bg-secondary/10">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-2xl font-light mb-10 text-center">Continue Reading</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {otherBlogs.map((b, i) => (
                <Link key={b.id} href={`/blog/${b.slug || b.id}`}>
                  <div className="group cursor-pointer block bg-background border border-border/50 hover:border-primary/50 transition-colors p-6">
                    <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground uppercase tracking-widest">
                      <span className="text-primary">{b.category || "Design"}</span>
                      <span>•</span>
                      <span>{b.readTime || 5} min read</span>
                    </div>
                    <h3 className="text-xl font-light mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {b.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
