import { Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/data";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.5 1.34 5.02L2 22l5.12-1.34A9.96 9.96 0 0 0 12.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm0 18.17c-1.6 0-3.17-.43-4.54-1.24l-.33-.19-3.04.8.81-2.96-.21-.3A8.17 8.17 0 0 1 3.83 12c0-4.53 3.68-8.21 8.21-8.21 2.2 0 4.26.86 5.81 2.41a8.15 8.15 0 0 1 2.4 5.8c0 4.53-3.68 8.17-8.21 8.17Zm4.49-6.13c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.17.25-.64.8-.78.96-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.17 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28Z" />
    </svg>
  );
}

export default async function FloatingContactButtons() {
  const settings = await getSiteSettings();
  const digits = settings.phone.replace(/[^\d]/g, "");
  const telHref = `tel:+${digits.replace(/^0+/, "")}`;
  const waHref = `https://wa.me/${digits}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <a
        href={telHref}
        aria-label={`Call ${settings.phone}`}
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-gold/50 bg-black/90 text-gold shadow-lg shadow-black/40 backdrop-blur transition-transform duration-300 hover:scale-110 hover:border-gold"
      >
        <Phone className="h-5 w-5" strokeWidth={1.75} />
      </a>
      <a
        href={waHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-gold/50 bg-black/90 text-gold shadow-lg shadow-black/40 backdrop-blur transition-transform duration-300 hover:scale-110 hover:border-gold"
      >
        <WhatsAppIcon className="h-5 w-5" />
      </a>
    </div>
  );
}
