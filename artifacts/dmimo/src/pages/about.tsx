import React from "react";
import { motion } from "framer-motion";
import { useListTeamMembers } from "@workspace/api-client-react";
import { Linkedin, Award } from "lucide-react";

import aboutImg from "@/assets/images/about.png";
import team1Img from "@/assets/images/team-1.png";

const getFallbackImage = () => team1Img;

export default function AboutPage() {
  const { data: teamMembers, isLoading } = useListTeamMembers();

  return (
    <div className="bg-background min-h-[100dvh] text-foreground pt-32 pb-20 overflow-hidden">
      {/* Hero */}
      <section className="container mx-auto px-6 mb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-light mb-6">The Studio</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light text-lg">
            A collective of visionary architects, designers, and urban planners dedicated to crafting timeless spaces.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="aspect-[21/9] w-full relative overflow-hidden"
        >
          <img src={aboutImg} alt="Studio Environment" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>
      </section>

      {/* Philosophy */}
      <section className="py-32 bg-secondary/20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm text-primary font-semibold tracking-[0.3em] uppercase mb-6">
                Our Philosophy
              </h2>
              <h3 className="text-4xl font-light leading-tight mb-8">
                Architecture as a <span className="text-primary italic font-serif">Living Art Form</span>
              </h3>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 text-muted-foreground font-light text-lg leading-relaxed"
            >
              <p>
                At DMIMO, we believe that the spaces we inhabit shape our experiences, emotions, and interactions. Our approach goes beyond mere aesthetics; it delves into the psychology of space and the poetry of light.
              </p>
              <p>
                Founded on the principles of rigorous technical mastery combined with unbridled creative vision, we design structures that respond deeply to their context, environment, and purpose. We are not just building for today—we are creating the heritage of tomorrow.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-sm text-primary font-semibold tracking-[0.3em] uppercase mb-4">Leadership</h2>
            <p className="text-4xl md:text-5xl font-light">Meet the Architects</p>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[3/4] bg-secondary/30 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(Array.isArray(teamMembers) ? teamMembers : []).map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative"
                >
                  <div className="aspect-[3/4] overflow-hidden mb-6 border border-transparent group-hover:border-primary/50 transition-colors duration-300">
                    <img
                      src={member.photo || getFallbackImage()}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl font-medium mb-1 flex items-center justify-between">
                    {member.name}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </h3>
                  <p className="text-xs text-primary uppercase tracking-widest mb-3">{member.role}</p>
                  {member.bio && (
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{member.bio}</p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Awards */}
      <section className="py-32 bg-secondary/10">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm text-primary font-semibold tracking-[0.3em] uppercase mb-4">Recognition</h2>
            <p className="text-4xl md:text-5xl font-light">Global Awards</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              { year: "2024", title: "Pritzker Architecture Prize Nomination", org: "Hyatt Foundation" },
              { year: "2023", title: "Excellence in Commercial Architecture", org: "AIA Global" },
              { year: "2022", title: "Sustainable Design of the Year", org: "World Green Building Council" },
              { year: "2021", title: "Best Luxury Residential Project", org: "International Property Awards" },
              { year: "2020", title: "Urban Planning Visionary Award", org: "City Future Institute" },
              { year: "2019", title: "Interior Design Firm of the Decade", org: "Design Excellence Forum" },
            ].map((award, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-border/50 p-6 bg-background hover:border-primary/50 transition-colors"
              >
                <Award className="w-8 h-8 text-primary/50 mb-4" />
                <span className="text-primary font-mono text-sm mb-2 block">{award.year}</span>
                <h4 className="text-lg font-light mb-2">{award.title}</h4>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">{award.org}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
