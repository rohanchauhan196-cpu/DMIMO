import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Home, Building2, Trees, PenTool, LayoutDashboard, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

import proj3Img from "@/assets/images/project-3.png";

export default function ServicesPage() {
  const services = [
    {
      icon: Home,
      title: "Luxury Residential Architecture",
      description: "Bespoke home designs that reflect the unique lifestyle and character of the client. From sprawling estates to intimate urban dwellings, our residential projects prioritize light, spatial flow, and material perfection.",
      features: ["Custom Estate Design", "Urban Townhomes", "Vacation Retreats", "Historical Restorations"]
    },
    {
      icon: Building2,
      title: "Commercial & Cultural",
      description: "Landmark structures that define corporate identity and public space. We create environments that enhance productivity, foster community, and stand as architectural statements within the urban fabric.",
      features: ["Corporate Headquarters", "Art Galleries & Museums", "Boutique Hospitality", "Retail Environments"]
    },
    {
      icon: PenTool,
      title: "Interior Architecture",
      description: "Seamless continuation of architectural vision into the interior realm. We curate every surface, fixture, and detail to create cohesive, sensory-rich environments of uncompromising quality.",
      features: ["Spatial Planning", "Custom Millwork", "Lighting Design", "Material Curation"]
    },
    {
      icon: Trees,
      title: "Landscape Integration",
      description: "Blurring the boundary between built structure and natural environment. Our landscape designs respond deeply to regional ecology while extending living spaces into the outdoors.",
      features: ["Site Masterplanning", "Sustainable Integration", "Water Features", "Botanical Curation"]
    },
    {
      icon: LayoutDashboard,
      title: "Adaptive Reuse & Renovation",
      description: "Breathing new life into existing structures. We honor historical context while injecting contemporary relevance, optimizing performance, and radically transforming the spatial experience.",
      features: ["Historical Preservation", "Modern Additions", "Structural Upgrades", "Spatial Reconfiguration"]
    },
    {
      icon: Globe,
      title: "Urban Planning & Strategy",
      description: "Large-scale visionary planning that shapes the future of communities. We balance density, sustainability, and human-scale experience in comprehensive masterplans.",
      features: ["District Masterplans", "Public Realm Design", "Feasibility Studies", "Sustainable Urbanism"]
    }
  ];

  return (
    <div className="bg-background min-h-[100dvh] text-foreground pt-32 pb-0">
      {/* Hero */}
      <section className="container mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-light mb-6">Expertise & Services</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light text-lg">
            Comprehensive architectural and design services tailored for visionary clients.
          </p>
        </motion.div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="space-y-32">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`grid md:grid-cols-2 gap-16 items-center ${idx % 2 === 1 ? 'md:grid-cols-[2fr_1fr]' : ''}`}
              >
                <div className={idx % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center mb-8 border border-border/50 text-primary">
                    <service.icon className="w-8 h-8 stroke-1" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-light mb-6">{service.title}</h2>
                  <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <ul className="grid grid-cols-2 gap-4">
                    {service.features.map((feat, i) => (
                      <li key={i} className="flex items-center text-sm font-light text-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={`relative aspect-square overflow-hidden bg-secondary/10 border border-border/30 ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <service.icon className="w-64 h-64" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process summary */}
      <section className="py-32 bg-secondary/20 border-y border-border">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-sm text-primary font-semibold tracking-[0.3em] uppercase mb-4">Methodology</h2>
          <p className="text-4xl md:text-5xl font-light mb-16">The DMIMO Process</p>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Discovery", desc: "Understanding site context, client vision, and fundamental constraints." },
              { num: "02", title: "Concept", desc: "Developing the overarching architectural narrative and spatial logic." },
              { num: "03", title: "Development", desc: "Rigorous technical detailing, material selection, and engineering." },
              { num: "04", title: "Execution", desc: "Meticulous oversight during construction to ensure uncompromised quality." }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-light text-primary/20 mb-4">{step.num}</div>
                <h3 className="text-lg font-medium mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground font-light">{step.desc}</p>
                {i < 3 && <div className="hidden md:block absolute top-6 right-[-2rem] w-8 h-[1px] bg-border" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={proj3Img} alt="Architecture Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-light mb-8">Ready to Build the Extraordinary?</h2>
          <p className="text-xl text-muted-foreground font-light mb-12">
            We are currently reviewing commissions for the upcoming design season.
          </p>
          <Link href="/#contact" className="inline-flex items-center justify-center whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90 rounded-none tracking-widest uppercase text-sm px-10 py-8 interactive group">
            Start a Conversation
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
