import type { Metadata } from "next";
import SectionLabel from "@/components/ui/SectionLabel";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <div className="bg-ivory pb-28 pt-40 text-charcoal-1 md:pb-36 md:pt-48">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <SectionLabel light className="mb-8">Legal</SectionLabel>
        <h1 className="font-display text-5xl font-light sm:text-6xl">Terms of Use</h1>
        <div className="prose prose-lg mt-12 max-w-none prose-headings:font-display prose-headings:font-light prose-p:text-charcoal-2/80 prose-p:leading-relaxed">
          <p>
            All content on this website, including project photography,
            text and the D Mimo Architects name and mark, is the property of
            D Mimo Architects unless otherwise credited, and may not be
            reproduced without written permission.
          </p>
          <p>
            Project information is presented for portfolio purposes. Areas,
            timelines and costs referenced are approximate and provided for
            illustrative purposes only.
          </p>
          <p className="text-sm text-charcoal-2/50">
            This is placeholder terms text. Replace with counsel-reviewed
            content before launch.
          </p>
        </div>
      </div>
    </div>
  );
}
