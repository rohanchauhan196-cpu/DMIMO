import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useListBlogs } from "@workspace/api-client-react";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

import proj4Img from "@/assets/images/project-4.png";
import proj5Img from "@/assets/images/project-5.png";
import proj2Img from "@/assets/images/project-2.png";

const getFallbackImage = (idx: number) => {
  const images = [proj4Img, proj5Img, proj2Img];
  return images[idx % images.length];
};

export default function BlogPage() {
  const { data: blogs, isLoading } = useListBlogs({ status: "published" });

  const blogsList = Array.isArray(blogs) ? blogs : [];
  const featuredBlog = blogsList[0];
  const regularBlogs = blogsList.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background min-h-[100dvh] pt-32 pb-20"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-light mb-6">The Journal</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light text-lg">
            Thoughts, perspectives, and insights on architecture, design, and the spaces we inhabit.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-16">
            <div className="w-full h-[60vh] bg-secondary/30 animate-pulse" />
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[16/9] bg-secondary/30 animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Featured Blog */}
            {featuredBlog && (
              <Link href={`/blog/${featuredBlog.slug || featuredBlog.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative h-[60vh] w-full overflow-hidden cursor-pointer block mb-20"
                >
                  <img
                    src={featuredBlog.coverImage || getFallbackImage(0)}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-4xl">
                    <div className="flex items-center gap-4 mb-4 text-xs text-primary uppercase tracking-widest">
                      <span className="bg-primary/20 px-3 py-1 backdrop-blur-md">{featuredBlog.category || "Insight"}</span>
                      <span className="text-white/70 flex items-center"><Clock className="w-3 h-3 mr-1"/> {featuredBlog.readTime || 5} min read</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-light text-white mb-4 group-hover:text-primary transition-colors">
                      {featuredBlog.title}
                    </h2>
                    {featuredBlog.excerpt && (
                      <p className="text-lg text-white/70 font-light mb-6 hidden md:block">
                        {featuredBlog.excerpt}
                      </p>
                    )}
                    <div className="flex items-center text-xs uppercase tracking-widest text-primary">
                      Read Article <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            )}

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {regularBlogs.map((blog, i) => (
                <Link key={blog.id} href={`/blog/${blog.slug || blog.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group cursor-pointer block"
                  >
                    <div className="aspect-[16/10] overflow-hidden mb-6 relative">
                      <img
                        src={blog.coverImage || getFallbackImage(i + 1)}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground uppercase tracking-widest">
                      <span className="text-primary">{blog.category || "Design"}</span>
                      <span>•</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3 className="text-2xl font-light mb-4 group-hover:text-primary transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="text-sm text-muted-foreground font-light line-clamp-3 mb-4">
                        {blog.excerpt}
                      </p>
                    )}
                    <div className="text-xs uppercase tracking-widest text-primary/70 flex items-center group-hover:text-primary transition-colors">
                      Read More <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {blogs?.length === 0 && (
              <div className="text-center py-20 text-muted-foreground font-light">
                No articles published yet. Check back soon.
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
