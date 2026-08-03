import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Menu, X, ArrowRight, ChevronDown, Check, Building2, Home as HomeIcon, 
  MapPin, Phone, Mail, Instagram, Linkedin, Twitter, Facebook, Building, 
  Trees, Shrub, Wrench, Lightbulb, Zap, Clock, Users, Globe, ShieldCheck, Award, Quote, ChevronRight, ChevronLeft
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArchitectureCanvas } from "@/components/Scene";
import { useToast } from "@/hooks/use-toast";
import { useListProjects, useListBlogs, useListTeamMembers, useCreateInquiry } from "@workspace/api-client-react";

// --- Images ---
import aboutImg from "@/assets/images/about.png";
import proj1Img from "@/assets/images/project-1.png";
import proj2Img from "@/assets/images/project-2.png";
import proj3Img from "@/assets/images/project-3.png";
import proj4Img from "@/assets/images/project-4.png";
import proj5Img from "@/assets/images/project-5.png";
import proj6Img from "@/assets/images/project-6.png";
import team1Img from "@/assets/images/team-1.png";
import team2Img from "@/assets/images/team-2.png";
import team3Img from "@/assets/images/team-3.png";

// Reuse project images for blog since we hit generation limits
const blog1Img = proj4Img;
const blog2Img = proj5Img;
const blog3Img = proj2Img;

// --- Animated Counter ---
const AnimatedCounter = ({ from = 0, to, duration = 2 }: { from?: number, to: number, duration?: number }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.5 }
    );
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * (to - from) + from);
      if (nodeRef.current) {
        nodeRef.current.innerText = currentCount.toString();
      }
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else if (nodeRef.current) {
        nodeRef.current.innerText = to.toString();
      }
    };
    window.requestAnimationFrame(step);
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{from}</span>;
};

// --- Custom Cursor ---
function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePos = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button') || target.closest('.interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mousemove', updatePos);
    return () => window.removeEventListener('mousemove', updatePos);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 rounded-full border border-primary pointer-events-none z-[100] mix-blend-difference hidden md:block"
      animate={{
        x: pos.x - 12,
        y: pos.y - 12,
        scale: isHovering ? 2 : 1,
        backgroundColor: isHovering ? 'rgba(212, 175, 55, 0.2)' : 'transparent'
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 2 }}
    />
  );
}

// --- Main Page Component ---
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const { data: projectsData } = useListProjects({ status: 'published' });
  const { data: blogsData } = useListBlogs({ status: 'published' });
  const { data: teamData } = useListTeamMembers();
  const createInquiry = useCreateInquiry();
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center fixed inset-0 z-50">
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="flex items-center gap-1"
          >
            {"DMIMO".split("").map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.5, duration: 0.5 }}
                className="text-6xl font-light tracking-[0.2em] text-primary"
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1 }}
      className="bg-background min-h-screen text-foreground relative overflow-hidden"
    >
      <CustomCursor />
      
      {/* Scroll Progress */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="group interactive">
            <div className="flex flex-col">
              <span className="text-2xl font-light tracking-[0.3em] text-foreground group-hover:text-primary transition-colors">DMIMO</span>
              <span className="text-[0.6rem] tracking-[0.4em] text-muted-foreground uppercase">Architectures</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest interactive">Home</Link>
            <Link href="/projects" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest interactive">Projects</Link>
            <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest interactive">Services</Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest interactive">Studio</Link>
            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest interactive">Journal</Link>
            <a href="/#contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest interactive">Contact</a>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-none tracking-widest uppercase text-xs interactive">
              Book Consultation
            </Button>
          </div>

          <button className="lg:hidden text-foreground interactive" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          className="fixed inset-0 bg-background z-50 flex flex-col p-6"
        >
          <div className="flex justify-end">
            <button onClick={() => setMobileMenuOpen(false)} className="text-foreground interactive">
              <X className="w-8 h-8" />
            </button>
          </div>
          <div className="flex flex-col space-y-8 mt-20 text-center">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-light text-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] interactive">Home</Link>
            <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-light text-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] interactive">Projects</Link>
            <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-light text-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] interactive">Services</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-light text-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] interactive">Studio</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-light text-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] interactive">Journal</Link>
            <a href="/#contact" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-light text-foreground hover:text-primary transition-colors uppercase tracking-[0.2em] interactive">Contact</a>
          </div>
        </motion.div>
      )}

      <main>
        {/* Hero */}
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <ArchitectureCanvas />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
          
          <motion.div 
            style={{ y: heroY }}
            className="container mx-auto px-6 relative z-20 text-center mt-20"
          >
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-6"
            >
              Creating Timeless Architecture
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl md:text-8xl lg:text-[10rem] font-light leading-none tracking-tight mb-4"
            >
              DMIMO
              <span className="block text-3xl md:text-5xl lg:text-7xl tracking-[0.2em] mt-2 text-muted-foreground">ARCHITECTURES</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-light mb-10 leading-relaxed"
            >
              We design extraordinary spaces that inspire generations—combining innovation, sustainability, and timeless elegance.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
            >
              <Link href="/#contact" className="inline-flex items-center justify-center whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90 rounded-none tracking-widest uppercase text-sm px-8 py-6 interactive h-11">
                Start Your Project
              </Link>
              <Link href="/projects" className="inline-flex items-center justify-center whitespace-nowrap border border-border text-foreground hover:bg-secondary rounded-none tracking-widest uppercase text-sm px-8 py-6 interactive h-11">
                View Portfolio
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center justify-center gap-2 text-xs text-muted-foreground uppercase tracking-widest"
            >
              <div className="flex text-primary">
                {[1,2,3,4,5].map(i => <span key={i}>★</span>)}
              </div>
              Trusted by homeowners, developers & commercial clients
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          >
            <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">Scroll</span>
            <div className="w-[1px] h-12 bg-border relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 w-full h-1/2 bg-primary"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="studio" className="py-32 bg-secondary/30 relative">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative aspect-[4/5] lg:aspect-square overflow-hidden"
              >
                <img 
                  src={aboutImg} 
                  alt="DMIMO Architecture Exterior" 
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
                <div className="absolute inset-0 border border-primary/20 m-4 pointer-events-none" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight">
                  Design Beyond <span className="text-primary italic font-serif">Imagination</span>
                </h2>
                <div className="space-y-6 text-muted-foreground font-light text-lg leading-relaxed">
                  <p>
                    Since our inception, DMIMO Architectures has been at the forefront of spatial innovation, redefining the boundaries between human experience and the built environment.
                  </p>
                  <p>
                    We approach every project as a unique narrative. From luxurious private residences to striking urban developments, our philosophy remains rooted in creating spaces that resonate with purpose, clarity, and enduring beauty.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mt-16 pt-10 border-t border-border">
                  {[
                    { label: "Projects", value: 150, suffix: "+" },
                    { label: "Years Experience", value: 18, suffix: "+" },
                    { label: "Architects", value: 40, suffix: "+" },
                    { label: "Satisfaction", value: 98, suffix: "%" }
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col">
                      <div className="text-4xl font-light text-primary flex items-baseline">
                        <AnimatedCounter to={stat.value} />{stat.suffix}
                      </div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-32">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-sm text-primary font-semibold tracking-[0.3em] uppercase mb-4">What We Create</h2>
              <p className="text-4xl md:text-5xl font-light">Comprehensive Expertise</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: HomeIcon, title: "Luxury Residential", desc: "Bespoke homes tailored to extraordinary lifestyles." },
                { icon: Building2, title: "Commercial Architecture", desc: "Corporate spaces that elevate brand identity." },
                { icon: Trees, title: "Landscape Design", desc: "Harmonious integration of nature and structure." },
                { icon: Globe, title: "Urban Planning", desc: "Masterplans shaping the future of communities." },
                { icon: Shrub, title: "Interior Design", desc: "Curated environments of exceptional quality." },
                { icon: Wrench, title: "Renovation", desc: "Restoring heritage with contemporary relevance." }
              ].map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="bg-secondary/30 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="p-8 relative z-10">
                      <service.icon className="w-10 h-10 text-primary mb-6 stroke-1" />
                      <h3 className="text-xl font-medium mb-3">{service.title}</h3>
                      <p className="text-muted-foreground font-light text-sm">{service.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section id="projects" className="py-32 bg-secondary/20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-between items-end mb-16"
            >
              <div>
                <h2 className="text-sm text-primary font-semibold tracking-[0.3em] uppercase mb-4">Our Work</h2>
                <p className="text-4xl md:text-5xl font-light">Featured Projects</p>
              </div>
              <Link href="/projects" className="hidden md:flex text-primary hover:text-primary/80 uppercase tracking-widest text-xs interactive">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(Array.isArray(projectsData) && projectsData.length > 0 ? projectsData.slice(0, 6) : [
                { img: proj1Img, title: "The Obsidian Villa", loc: "Malibu, CA", type: "Residential", year: "2023", slug: "" },
                { img: proj2Img, title: "Lumina Tower", loc: "Tokyo, JP", type: "Commercial", year: "2024", slug: "" },
                { img: proj3Img, title: "Aura Resort", loc: "Bali, ID", type: "Hospitality", year: "2022", slug: "" },
                { img: proj4Img, title: "Modern Art Pavillion", loc: "London, UK", type: "Cultural", year: "2024", slug: "" },
                { img: proj5Img, title: "Skyline Penthouse", loc: "New York, NY", type: "Interior", year: "2023", slug: "" },
                { img: proj6Img, title: "Nexus Plaza", loc: "Dubai, AE", type: "Urban", year: "2025", slug: "" }
              ]).map((proj: any, i) => (
                <Link key={proj.id || i} href={`/projects/${proj.slug || proj.id || ''}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative aspect-[4/5] overflow-hidden cursor-pointer interactive block"
                  >
                    <img 
                      src={proj.coverImage || proj.img || [proj1Img, proj2Img, proj3Img, proj4Img, proj5Img, proj6Img][i % 6]} 
                      alt={proj.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    
                    <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[0.65rem] uppercase tracking-widest text-primary border border-primary/30 px-2 py-1 bg-background/50 backdrop-blur-sm">
                          {proj.category || proj.type}
                        </span>
                        <span className="text-xs text-white/70">{proj.year}</span>
                      </div>
                      <h3 className="text-2xl font-light text-white mb-1">{proj.title}</h3>
                      <p className="text-sm text-white/70 flex items-center mb-6">
                        <MapPin className="w-3 h-3 mr-1" /> {proj.location || proj.loc || 'Confidential'}
                      </p>
                      <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                        <span className="text-xs uppercase tracking-widest text-primary flex items-center group/btn">
                          View Project <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
            
            <div className="mt-12 text-center md:hidden">
              <Link href="/projects" className="inline-flex items-center justify-center whitespace-nowrap border border-border text-foreground hover:bg-secondary rounded-none tracking-widest uppercase text-xs px-8 py-6 interactive">
                View All Projects
              </Link>
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="py-32">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-sm text-primary font-semibold tracking-[0.3em] uppercase mb-4">How We Build</h2>
              <p className="text-4xl md:text-5xl font-light">Our Design Process</p>
            </motion.div>

            <div className="relative">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-border -translate-y-1/2 z-0" />
              <div className="grid md:grid-cols-6 gap-8">
                {[
                  { step: "01", title: "Discovery", desc: "Understanding context and vision." },
                  { step: "02", title: "Concept", desc: "Defining architectural language." },
                  { step: "03", title: "Planning", desc: "Rigorous technical detailing." },
                  { step: "04", title: "Visualization", desc: "Photorealistic spatial previews." },
                  { step: "05", title: "Construction", desc: "Meticulous site execution." },
                  { step: "06", title: "Completion", desc: "Handover of the masterpiece." }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative z-10 flex flex-col md:items-center text-left md:text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-background border border-primary text-primary flex items-center justify-center text-lg font-light mb-6 md:mb-8 mx-0 md:mx-auto">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                    <p className="text-xs text-muted-foreground font-light">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-32 bg-secondary/10">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-sm text-primary font-semibold tracking-[0.3em] uppercase mb-4">The DMIMO Difference</h2>
              <p className="text-4xl md:text-5xl font-light">Why Choose Us</p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Award, title: "Award Winning Designs" },
                { icon: Trees, title: "Sustainable Architecture" },
                { icon: Lightbulb, title: "Innovative Technology" },
                { icon: Users, title: "Client Centric Approach" },
                { icon: ShieldCheck, title: "Experienced Team" },
                { icon: Globe, title: "Global Design Standards" },
                { icon: Clock, title: "Transparent Process" },
                { icon: Zap, title: "Premium Quality" }
              ].map((reason, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start"
                >
                  <reason.icon className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium mb-2">{reason.title}</h3>
                    <p className="text-sm text-muted-foreground font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-32">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-sm text-primary font-semibold tracking-[0.3em] uppercase mb-4">What Clients Say</h2>
              <p className="text-4xl md:text-5xl font-light">Testimonials</p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <Carousel
                opts={{ align: "start", loop: true }}
                className="w-full"
              >
                <CarouselContent>
                  {[
                    { quote: "Working with DMIMO was an absolute revelation. They didn't just design a house; they shaped a living environment perfectly tailored to our lifestyle. The attention to detail is unparalleled.", name: "Eleanor Vance", role: "Private Client" },
                    { quote: "Their ability to balance monumental commercial ambition with delicate human-scale detail is why we chose them for our global headquarters. A masterpiece of modern engineering.", name: "Julian Thorne", role: "CEO, Vertex Holdings" },
                    { quote: "DMIMO brings a rare combination of poetic vision and pragmatic execution. Our resort project was completed ahead of schedule without a single compromise on quality.", name: "Amira Patel", role: "Director of Development, Azure Hotels" },
                    { quote: "The most seamless design process I've experienced in 20 years of real estate development. The DMIMO team is responsive, visionary, and exact in their methods.", name: "Robert Chen", role: "Managing Partner, Orion Group" }
                  ].map((testimonial, i) => (
                    <CarouselItem key={i} className="md:basis-1/1">
                      <div className="p-1">
                        <Card className="bg-secondary/30 backdrop-blur-sm border-border/50 border-0 p-8 md:p-12 text-center">
                          <CardContent>
                            <Quote className="w-12 h-12 text-primary/40 mx-auto mb-8" />
                            <p className="text-xl md:text-2xl font-light text-foreground mb-8 leading-relaxed italic">
                              "{testimonial.quote}"
                            </p>
                            <div className="flex text-primary justify-center mb-4">
                              {[1,2,3,4,5].map(star => <span key={star}>★</span>)}
                            </div>
                            <h4 className="font-medium text-lg">{testimonial.name}</h4>
                            <p className="text-sm text-muted-foreground uppercase tracking-widest mt-1">{testimonial.role}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-8 gap-4">
                  <CarouselPrevious className="static transform-none bg-background border-border hover:bg-secondary text-primary" />
                  <CarouselNext className="static transform-none bg-background border-border hover:bg-secondary text-primary" />
                </div>
              </Carousel>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-32 bg-secondary/10">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-sm text-primary font-semibold tracking-[0.3em] uppercase mb-4">The Studio</h2>
              <p className="text-4xl md:text-5xl font-light">Our Leadership</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(Array.isArray(teamData) && teamData.length > 0 ? teamData.slice(0, 4) : [
                { img: team1Img, name: "David Miller", role: "Principal Architect", bio: "20 years of crafting iconic structures." },
                { img: team2Img, name: "Sarah Chen", role: "Design Director", bio: "Visionary behind our commercial portfolio." },
                { img: team3Img, name: "Marcus Johnson", role: "Lead Urban Planner", bio: "Shaping the sustainable cities of tomorrow." },
                { img: team1Img, name: "Elena Rodriguez", role: "Interior Design Lead", bio: "Creating intimate, luxurious interior spaces." }
              ]).map((member: any, i) => (
                <motion.div
                  key={member.id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative cursor-pointer"
                >
                  <div className="aspect-[3/4] overflow-hidden mb-6 border border-transparent group-hover:border-primary/50 transition-colors duration-300">
                    <img src={member.photo || member.img || [team1Img, team2Img, team3Img, team1Img][i % 4]} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  </div>
                  <h3 className="text-xl font-medium mb-1 flex items-center justify-between">
                    {member.name} {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer"><Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" /></a>}
                  </h3>
                  <p className="text-xs text-primary uppercase tracking-widest mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground font-light line-clamp-3">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-between items-end mb-16"
            >
              <div>
                <h2 className="text-sm text-primary font-semibold tracking-[0.3em] uppercase mb-4">Insights & Ideas</h2>
                <p className="text-4xl md:text-5xl font-light">Latest from the Journal</p>
              </div>
              <Link href="/blog" className="hidden md:flex text-primary hover:text-primary/80 uppercase tracking-widest text-xs interactive">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {(Array.isArray(blogsData) && blogsData.length > 0 ? blogsData.slice(0, 3) : [
                { img: blog1Img, tag: "Architecture", title: "The Resurgence of Brutalism in Modern Luxury Homes", date: "Oct 12, 2023", read: "5 min read", slug: "" },
                { img: blog2Img, tag: "Sustainability", title: "Passive Cooling: Designing for a Warmer Climate", date: "Nov 04, 2023", read: "8 min read", slug: "" },
                { img: blog3Img, tag: "Design", title: "The Psychology of Light in Commercial Spaces", date: "Dec 18, 2023", read: "6 min read", slug: "" }
              ]).map((article: any, i) => (
                <Link key={article.id || i} href={`/blog/${article.slug || article.id || ''}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group cursor-pointer interactive block"
                  >
                    <div className="aspect-[16/9] overflow-hidden mb-6">
                      <img src={article.coverImage || article.img || [blog1Img, blog2Img, blog3Img][i % 3]} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    </div>
                    <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground uppercase tracking-widest">
                      <span className="text-primary">{article.category || article.tag || "Insight"}</span>
                      <span>•</span>
                      <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : article.date}</span>
                    </div>
                    <h3 className="text-2xl font-light mb-4 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-muted-foreground">{article.readTime ? `${article.readTime} min read` : article.read}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-32 bg-secondary/10">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-sm text-primary font-semibold tracking-[0.3em] uppercase mb-4">Common Questions</h2>
              <p className="text-4xl md:text-5xl font-light">Frequently Asked Questions</p>
            </motion.div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {[
                { q: "What is your typical design process timeline?", a: "A standard luxury residential project typically takes 4-6 months for the comprehensive design phase (Discovery through Visualization), followed by the construction timeline which varies based on scale and complexity." },
                { q: "Do you handle the construction phase as well?", a: "While we are primarily a design studio, we offer comprehensive Construction Administration services. We partner with elite builders and oversee every detail to ensure the final result perfectly matches our vision." },
                { q: "What is the minimum budget for a DMIMO project?", a: "Our commissions typically start at $2M for residential projects and $5M for commercial developments. We focus on projects where we can deliver uncompromising quality without budget constraints restricting the architectural vision." },
                { q: "Do you take international projects?", a: "Yes. Approximately 40% of our portfolio consists of international commissions. We have experience navigating diverse building codes, climates, and cultural contexts across Europe, Asia, and the Middle East." },
                { q: "How do you approach sustainable design?", a: "Sustainability is fundamentally integrated into our process, not applied as an afterthought. We focus on passive design principles, material longevity, and advanced energy systems to create buildings that perform as beautifully as they look." }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border bg-background px-6 py-2">
                  <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors hover:no-underline text-left">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-light leading-relaxed pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
        
        {/* Contact */}
        <section id="contact" className="py-32 bg-secondary/50 relative border-t border-border">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-sm text-primary font-semibold tracking-[0.3em] uppercase mb-4">Let's Build Together</h2>
                <p className="text-4xl md:text-6xl font-light mb-8">Start a Conversation</p>
                <p className="text-muted-foreground mb-12 max-w-md font-light">
                  We are currently accepting inquiries for new commissions starting next quarter.
                </p>
                
                <div className="space-y-8 mb-12">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-primary mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm uppercase tracking-widest font-medium mb-1">Global Studio</h4>
                      <p className="text-muted-foreground font-light">120 Architecture Blvd, Suite 400<br/>New York, NY 10012</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-primary mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm uppercase tracking-widest font-medium mb-1">Inquiries</h4>
                      <p className="text-muted-foreground font-light">vision@dmimo-arch.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-primary mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm uppercase tracking-widest font-medium mb-1">Phone</h4>
                      <p className="text-muted-foreground font-light">+1 (212) 555-0198</p>
                    </div>
                  </div>
                </div>

                <div className="h-48 w-full bg-background border border-border relative overflow-hidden flex items-center justify-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-20">
                    {Array.from({length: 24}).map((_, i) => (
                      <div key={i} className="border border-primary/20" />
                    ))}
                  </div>
                  <MapPin className="w-8 h-8 text-primary relative z-10" />
                  <div className="absolute w-4 h-4 bg-primary/20 rounded-full animate-ping z-0" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="bg-background/50 backdrop-blur-md border-border rounded-none">
                  <CardContent className="p-8 lg:p-12">
                    <form className="space-y-8" onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      createInquiry.mutate({
                        data: {
                          name: fd.get("name") as string,
                          email: fd.get("email") as string,
                          phone: fd.get("phone") as string,
                          projectType: fd.get("projectType") as string,
                          message: fd.get("message") as string,
                        }
                      }, {
                        onSuccess: () => {
                          toast({ title: "Inquiry received. We'll be in touch." });
                          (e.target as HTMLFormElement).reset();
                        }
                      });
                    }}>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</label>
                          <Input name="name" required className="bg-transparent border-border/50 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-foreground text-lg py-2" placeholder="John Doe" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs uppercase tracking-widest text-muted-foreground">Email Address</label>
                          <Input name="email" required type="email" className="bg-transparent border-border/50 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-foreground text-lg py-2" placeholder="john@example.com" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-xs uppercase tracking-widest text-muted-foreground">Phone Number</label>
                          <Input name="phone" type="tel" className="bg-transparent border-border/50 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-foreground text-lg py-2" placeholder="+1 (555) 000-0000" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs uppercase tracking-widest text-muted-foreground">Project Type</label>
                          <select name="projectType" className="w-full bg-transparent border-border/50 border-0 border-b rounded-none px-0 focus:ring-0 focus:border-primary text-foreground text-lg py-2 appearance-none">
                            <option value="residential" className="bg-background">Residential</option>
                            <option value="commercial" className="bg-background">Commercial</option>
                            <option value="hospitality" className="bg-background">Hospitality</option>
                            <option value="urban" className="bg-background">Urban Planning</option>
                            <option value="other" className="bg-background">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground">Budget Range</label>
                        <select name="budget" className="w-full bg-transparent border-border/50 border-0 border-b rounded-none px-0 focus:ring-0 focus:border-primary text-foreground text-lg py-2 appearance-none">
                          <option value="tier1" className="bg-background">$2M - $5M</option>
                          <option value="tier2" className="bg-background">$5M - $10M</option>
                          <option value="tier3" className="bg-background">$10M - $25M</option>
                          <option value="tier4" className="bg-background">$25M+</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground">Project Details</label>
                        <Textarea 
                          name="message"
                          required
                          className="bg-transparent border-border/50 border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-foreground min-h-[120px] resize-none text-lg py-2" 
                          placeholder="Tell us about your vision, location, and timeline..." 
                        />
                      </div>
                      <Button disabled={createInquiry.isPending} type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none tracking-widest uppercase text-sm py-8 mt-4 interactive group">
                        {createInquiry.isPending ? "Sending..." : "Let's Build Something Extraordinary"}
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <Link href="/" className="inline-block mb-6 interactive">
                <div className="flex flex-col">
                  <span className="text-2xl font-light tracking-[0.3em] text-foreground">DMIMO</span>
                  <span className="text-[0.6rem] tracking-[0.4em] text-primary uppercase">Architectures</span>
                </div>
              </Link>
              <p className="text-muted-foreground text-sm font-light max-w-xs">
                Creating spaces that transcend time, defined by clarity, purpose, and enduring elegance.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium tracking-widest uppercase mb-6 text-foreground">Studio</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm font-light interactive">About Us</Link></li>
                <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors text-sm font-light interactive">Services</Link></li>
                <li><Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors text-sm font-light interactive">Portfolio</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm font-light interactive">Journal</Link></li>
                <li><Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors text-sm font-light interactive">Admin Portal</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium tracking-widest uppercase mb-6 text-foreground">Connect</h4>
              <ul className="space-y-4">
                <li><a href="/#contact" className="text-muted-foreground hover:text-primary transition-colors text-sm font-light interactive">Contact</a></li>
                {['Press', 'Privacy Policy', 'Terms of Service'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-light interactive">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium tracking-widest uppercase mb-6 text-foreground">Newsletter</h4>
              <p className="text-muted-foreground text-sm font-light mb-4">Subscribe to our journal for architectural insights.</p>
              <div className="flex">
                <Input placeholder="Email Address" className="bg-transparent border-border rounded-none border-r-0 focus-visible:ring-0 focus-visible:border-primary text-sm" />
                <Button variant="outline" className="border-border rounded-none text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-widest text-xs interactive">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50 text-xs text-muted-foreground font-light">
            <p>© {new Date().getFullYear()} DMIMO Architectures. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors interactive"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="hover:text-primary transition-colors interactive"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="hover:text-primary transition-colors interactive"><Twitter className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
