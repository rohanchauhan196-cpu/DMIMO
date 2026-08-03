import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useListProjects } from "@workspace/api-client-react";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

import proj1Img from "@/assets/images/project-1.png";
import proj2Img from "@/assets/images/project-2.png";
import proj3Img from "@/assets/images/project-3.png";

// Helper to get fallback images
const getFallbackImage = (idx: number) => {
  const images = [proj1Img, proj2Img, proj3Img];
  return images[idx % images.length];
};

export default function ProjectsPage() {
  const { data: projects, isLoading } = useListProjects({ status: "published" });
  const [filter, setFilter] = useState<string>("All");

  const projectsList = Array.isArray(projects) ? projects : [];
  const categories = ["All", ...Array.from(new Set(projectsList.map((p) => p.category)))];

  const filteredProjects = projectsList.filter(
    (p) => filter === "All" || p.category === filter
  );

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
          <h1 className="text-5xl md:text-7xl font-light mb-6">Our Portfolio</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light text-lg">
            A curated selection of our most significant residential, commercial, and cultural commissions.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              onClick={() => setFilter(cat)}
              className={`rounded-none tracking-widest uppercase text-xs px-6 py-5 ${
                filter === cat
                  ? "bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-primary hover:border-primary"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/5] bg-secondary/30 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects?.map((proj, i) => (
              <Link key={proj.id} href={`/projects/${proj.slug || proj.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative aspect-[4/5] overflow-hidden cursor-pointer block"
                >
                  <img
                    src={proj.coverImage || getFallbackImage(i)}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[0.65rem] uppercase tracking-widest text-primary border border-primary/30 px-2 py-1 bg-background/50 backdrop-blur-sm">
                        {proj.category}
                      </span>
                      <span className="text-xs text-white/70">{proj.year}</span>
                    </div>
                    <h3 className="text-2xl font-light text-white mb-1">{proj.title}</h3>
                    {proj.location && (
                      <p className="text-sm text-white/70 flex items-center mb-6">
                        <MapPin className="w-3 h-3 mr-1" /> {proj.location}
                      </p>
                    )}
                    <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                      <span className="text-xs uppercase tracking-widest text-primary flex items-center group/btn">
                        View Project{" "}
                        <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && filteredProjects?.length === 0 && (
          <div className="text-center py-20 text-muted-foreground font-light">
            No projects found in this category.
          </div>
        )}
      </div>
    </motion.div>
  );
}
