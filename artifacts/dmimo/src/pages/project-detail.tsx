import React from "react";
import { useRoute } from "wouter";
import { useGetProject, useListProjects } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Building, Calendar, Grid } from "lucide-react";
import { Link } from "wouter";

import proj1Img from "@/assets/images/project-1.png";
import proj2Img from "@/assets/images/project-2.png";
import proj3Img from "@/assets/images/project-3.png";

const getFallbackImage = (idx: number) => {
  const images = [proj1Img, proj2Img, proj3Img];
  return images[idx % images.length];
};

export default function ProjectDetail() {
  const [match, params] = useRoute("/projects/:slug");
  const slug = params?.slug || "";

  const { data: project, isLoading, isError } = useGetProject(slug);
  const { data: relatedProjects } = useListProjects({ status: "published" });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background flex-col gap-4 text-center">
        <h1 className="text-4xl font-light">Project Not Found</h1>
        <Link href="/projects" className="text-primary hover:underline uppercase tracking-widest text-xs">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  const otherProjects = relatedProjects?.filter(p => p.id !== project.id).slice(0, 3);

  return (
    <div className="bg-background min-h-[100dvh] text-foreground">
      {/* Hero */}
      <section className="relative h-[80vh] flex items-end pb-20">
        <div className="absolute inset-0 z-0">
          <img
            src={project.coverImage || getFallbackImage(0)}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <Link href="/projects" className="inline-flex items-center text-xs uppercase tracking-widest text-primary hover:text-primary/80 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-4 block">
              {project.category}
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 leading-tight">
              {project.title}
            </h1>
            {project.shortDescription && (
              <p className="text-xl text-muted-foreground font-light max-w-3xl">
                {project.shortDescription}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Specs */}
      <section className="py-12 border-b border-border/50 bg-secondary/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="flex items-center text-primary mb-1">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-xs uppercase tracking-widest">Location</span>
              </div>
              <p className="text-lg font-light">{project.location || "Confidential"}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-primary mb-1">
                <Building className="w-4 h-4 mr-2" />
                <span className="text-xs uppercase tracking-widest">Client</span>
              </div>
              <p className="text-lg font-light">{project.client || "Private Client"}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-primary mb-1">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-xs uppercase tracking-widest">Year</span>
              </div>
              <p className="text-lg font-light">{project.year || "2024"}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-primary mb-1">
                <Grid className="w-4 h-4 mr-2" />
                <span className="text-xs uppercase tracking-widest">Area</span>
              </div>
              <p className="text-lg font-light">{project.area || "N/A"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-32">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-[1fr_2fr] gap-16">
            <div>
              <h2 className="text-sm text-primary font-semibold tracking-[0.3em] uppercase mb-6 sticky top-32">
                The Vision
              </h2>
            </div>
            <div className="prose prose-invert prose-lg font-light text-muted-foreground">
              {project.description ? (
                <div dangerouslySetInnerHTML={{ __html: project.description }} />
              ) : (
                <p>Detailed description is being prepared for this project.</p>
              )}
            </div>
          </div>

          {(project.challenge || project.solution) && (
            <div className="grid md:grid-cols-[1fr_2fr] gap-16 mt-32">
              <div>
                <h2 className="text-sm text-primary font-semibold tracking-[0.3em] uppercase mb-6 sticky top-32">
                  Challenge & Solution
                </h2>
              </div>
              <div className="space-y-12">
                {project.challenge && (
                  <div>
                    <h3 className="text-2xl font-light text-foreground mb-4">The Challenge</h3>
                    <p className="text-lg text-muted-foreground font-light leading-relaxed">
                      {project.challenge}
                    </p>
                  </div>
                )}
                {project.solution && (
                  <div>
                    <h3 className="text-2xl font-light text-foreground mb-4">The Solution</h3>
                    <p className="text-lg text-muted-foreground font-light leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Grid */}
      {(project.images && project.images.length > 0) && (
        <section className="py-12 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.images.map((img, idx) => (
                <div key={idx} className={`relative overflow-hidden aspect-[4/3] ${idx % 3 === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}>
                  <img src={img} alt={`${project.title} gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Projects */}
      {otherProjects && otherProjects.length > 0 && (
        <section className="py-32">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-sm text-primary font-semibold tracking-[0.3em] uppercase mb-4">Explore More</h2>
              <p className="text-4xl font-light">Similar Projects</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {otherProjects.map((proj, i) => (
                <Link key={proj.id} href={`/projects/${proj.slug || proj.id}`}>
                  <div className="group relative aspect-[4/5] overflow-hidden cursor-pointer block">
                    <img
                      src={proj.coverImage || getFallbackImage(i)}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    
                    <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-light text-white mb-1">{proj.title}</h3>
                      <p className="text-sm text-primary uppercase tracking-widest">{proj.category}</p>
                    </div>
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
