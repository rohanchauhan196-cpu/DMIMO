import type { Metadata } from "next";
import SectionLabel from "@/components/ui/SectionLabel";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="bg-ivory pb-28 pt-40 text-charcoal-1 md:pb-36 md:pt-48">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <SectionLabel light className="mb-8">Legal</SectionLabel>
        <h1 className="font-display text-5xl font-light sm:text-6xl">Privacy Policy</h1>
        <div className="prose prose-lg mt-12 max-w-none prose-headings:font-display prose-headings:font-light prose-p:text-charcoal-2/80 prose-p:leading-relaxed">
          <p>
            D Mimo Architects (&quot;we&quot;, &quot;us&quot;) collects the
            information you submit through our contact form — your name,
            email, phone number and project details — solely to respond to
            your enquiry. We do not sell or share this information with
            third parties for marketing purposes.
          </p>
          <p>
            Information submitted is retained for as long as necessary to
            respond to your enquiry and maintain our business records. You
            may request that we delete your information at any time by
            emailing our studio directly.
          </p>
          <p>
            This website uses only essential cookies required for core
            functionality. We do not use third-party advertising trackers.
          </p>
          <p className="text-sm text-charcoal-2/50">
            This is placeholder policy text. Replace with counsel-reviewed
            content before launch.
          </p>
        </div>
      </div>
    </div>
  );
}
