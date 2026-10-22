import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import Introduction from "@/components/sections/Introduction";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import AboutHomeSection from "@/components/sections/AboutHomeSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PortfolioPreviewSection from "@/components/sections/PortfolioPreviewSection";
import ProcessSection from "@/components/sections/ProcessSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import LatestBlogs from "@/components/sections/LatestBlogs";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: { absolute: "D Mimo Architects — Architecture, Interiors & Design" },
  description:
    "D Mimo Architects is an international studio for architecture, interior design and master planning, creating spaces designed to be experienced.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Introduction />
      <FeaturedProjects />
      <AboutHomeSection />
      <ServicesSection />
      <PortfolioPreviewSection />
      <ProcessSection />
      <TestimonialsSection />
      <LatestBlogs />
      <CTASection />
    </>
  );
}
