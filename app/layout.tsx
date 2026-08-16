import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { siteConfig, siteUrl } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Rubén Palomo | Software, automatización e IA para pymes",
    description:
      "Soluciones web y software a medida para digitalizar procesos, conectar herramientas y aplicar inteligencia artificial de forma útil.",
    url: "/",
    siteName: siteConfig.name,
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: siteConfig.socialImage,
        width: 800,
        height: 800,
        alt: "Retrato profesional de Rubén Palomo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Rubén Palomo | Software, automatización e IA para pymes",
    description:
      "Desarrollo soluciones digitales para reducir tareas manuales, conectar aplicaciones y mejorar procesos de negocio.",
    images: [siteConfig.socialImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#142a27",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
