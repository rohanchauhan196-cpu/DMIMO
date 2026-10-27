import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
import JsonLd from "@/components/JsonLd";
import { getSiteSettings } from "@/lib/data";
import "./globals.css";

// Every page reads live data from Neon, so render on each request instead of
// freezing the database content at build time. Without this, changes made in
// the admin panel never show on the public site until the next redeploy.
export const dynamic = "force-dynamic";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: {
    default: "D Mimo Architects — Architecture, Interiors & Design",
    template: "%s | D Mimo Architects",
  },
  description:
    "D Mimo Architects is an international studio for architecture, interior design and master planning, creating spaces designed to be experienced.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "D Mimo Architects",
            url: baseUrl,
            logo: `${baseUrl}/logo.png`,
            email: settings.email,
            telephone: settings.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: settings.address,
            },
            sameAs: [settings.instagramUrl, settings.linkedinUrl, settings.pinterestUrl, settings.behanceUrl].filter(
              Boolean
            ),
          }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
