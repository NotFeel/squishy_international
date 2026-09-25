import type { Metadata, Viewport } from "next";
import { Analytics } from "@/components/Analytics";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site, withBasePath } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Cute Squishy Toys, Wholesale & OEM`,
    template: `%s | ${site.name}`,
  },
  description:
    "Discover soft, slow-rising squishy toys for gifting, retail and stress relief. Wholesale and custom OEM projects available.",
  keywords: [
    "squishy toys",
    "squishy wholesale",
    "custom squishy",
    "stress relief toys",
    "OEM squishy",
  ],
  icons: {
    icon: withBasePath("/brand/favicon.svg"),
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    url: site.url,
    title: `${site.name} | Cute Squishy Toys Made to Make You Smile`,
    description:
      "Soft, slow-rising squishy toys for gifting, retail and custom projects.",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "A colorful collection of soft squishy toys",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Cute Squishy Toys`,
    description:
      "Soft, slow-rising squishy toys for gifting, retail and custom projects.",
    images: ["/brand/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAFAF7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <Analytics />
      </body>
    </html>
  );
}
