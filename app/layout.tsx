import type { Metadata, Viewport } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

import { CookieConsent } from "@/components/cookie-consent";
import { siteConfig, siteUrl } from "@/lib/site";

import "./globals.css";

const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?.trim() || "G-00QTESDMTY";

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
      <body>
        {children}
        <CookieConsent />
        <Script id="google-analytics-consent" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            var analyticsStorage = 'denied';
            try {
              var storedConsent = JSON.parse(localStorage.getItem('ruben-palomo-cookie-consent-v1') || 'null');
              if (storedConsent && storedConsent.choice === 'accepted') analyticsStorage = 'granted';
            } catch (error) {}

            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: analyticsStorage,
              wait_for_update: 500
            });
          `}
        </Script>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} strategy="afterInteractive" />
        <Script id="google-analytics-config" strategy="afterInteractive">
          {`
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
        </Script>
      </body>
    </html>
  );
}
