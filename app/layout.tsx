import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/site";

const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: "24/7 Cabo pharmacy with fast delivery in Cabo San Lucas & San José. English-speaking pharmacy, secure hotel service & trusted urgent care.",
  openGraph: { siteName: SITE.name, type: "website", locale: "en_US" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <a href={SITE.whatsapp} target="_blank" rel="noopener" aria-label="Chat on WhatsApp"
          className="fixed bottom-5 right-5 z-50 rounded-full bg-[#25d366] px-5 py-3 font-semibold text-[#06231a] shadow-xl hover:scale-105 transition">
          WhatsApp 24/7
        </a>
      </body>
    </html>
  );
}
