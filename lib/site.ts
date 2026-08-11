const defaultSiteUrl = "https://rubenpalomo.vercel.app/";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = new URL(configuredSiteUrl || defaultSiteUrl);

export const siteConfig = {
  name: "Rubén Palomo",
  title: "Rubén Palomo | Desarrollo web, software, automatización e IA",
  description:
    "Desarrollo web y software a medida, automatización de procesos e inteligencia artificial práctica para autónomos, pequeñas empresas y pymes.",
  email: "ruben.palomof@gmail.com",
  phone: "+34635028815",
  phoneLabel: "+34 635 02 88 15",
  linkedin: "https://www.linkedin.com/in/ruben-palomo-fontan/",
  github: "https://github.com/RubenPalomo",
  socialImage: "/images/ruben-palomo-profesional.jpg",
} as const;

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": new URL("#ruben-palomo", siteUrl).toString(),
      name: siteConfig.name,
      url: siteUrl.toString(),
      image: new URL(siteConfig.socialImage, siteUrl).toString(),
      jobTitle:
        "Desarrollador de software y consultor de automatización e inteligencia artificial",
      sameAs: [siteConfig.linkedin, siteConfig.github],
      knowsAbout: [
        "Desarrollo web",
        "Software a medida",
        "Automatización de procesos",
        "Integración de APIs",
        "Inteligencia artificial aplicada",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": new URL("#servicio-profesional", siteUrl).toString(),
      name: "Rubén Palomo — Desarrollo de software, automatización e IA",
      url: siteUrl.toString(),
      description:
        "Desarrollo web y software a medida, automatización de procesos, integraciones y soluciones de inteligencia artificial para autónomos, pequeñas empresas y pymes.",
      founder: { "@id": new URL("#ruben-palomo", siteUrl).toString() },
      areaServed: "ES",
      email: siteConfig.email,
      telephone: siteConfig.phone,
      sameAs: [siteConfig.linkedin, siteConfig.github],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servicios digitales",
        itemListElement: [
          "Desarrollo web",
          "Software a medida",
          "Automatización de procesos",
          "Consultoría e implementación de inteligencia artificial",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name },
        })),
      },
    },
  ],
};
