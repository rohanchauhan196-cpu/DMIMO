import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContactButtons from "@/components/layout/FloatingContactButtons";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <Navbar />
      <main className="min-h-screen bg-black">{children}</main>
      <Footer />
      <FloatingContactButtons />
    </SmoothScrollProvider>
  );
}
