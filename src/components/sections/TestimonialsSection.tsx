import SectionLabel from "@/components/ui/SectionLabel";
import TestimonialsCarousel from "@/components/sections/TestimonialsCarousel";
import { getTestimonials } from "@/lib/data";

export default async function TestimonialsSection() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-black py-28 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="mb-16 flex justify-center">
          <SectionLabel>Client Reflections</SectionLabel>
        </div>
        <TestimonialsCarousel testimonials={testimonials} />
      </div>
    </section>
  );
}
