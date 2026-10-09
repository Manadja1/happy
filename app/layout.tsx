import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#E05A47",
};

export const metadata: Metadata = {
  title: {
    default: "HAPPY EVENTS — Votre événement. Un seul espace. Zéro stress.",
    template: "%s | HAPPY EVENTS",
  },
  description:
    "Plateforme intelligente pour créer, organiser, partager par WhatsApp, gérer et immortaliser vos événements en Côte d'Ivoire et Afrique francophone.",
  keywords: [
    "événements",
    "mariage",
    "anniversaire",
    "dot",
    "invitation numérique",
    "RSVP WhatsApp",
    "check-in QR code",
    "Abidjan",
    "Côte d'Ivoire",
  ],
  authors: [{ name: "HAPPY EVENTS Team" }],
  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: "https://happyevents.ci",
    siteName: "HAPPY EVENTS",
    title: "HAPPY EVENTS — Votre événement. Un seul espace. Zéro stress.",
    description:
      "Créez votre invitation, collectez les RSVP par WhatsApp et contrôlez les entrées avec QR code.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FAF8F5] text-[#0F172A] antialiased">
        {children}
      </body>
    </html>
  );
}
