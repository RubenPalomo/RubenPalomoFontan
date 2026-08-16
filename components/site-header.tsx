"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const navigationItems = [
  { href: "#servicios", label: "Qué puedo hacer" },
  { href: "#newsletter", label: "Newsletter" },
] as const;

const observedSections = [...navigationItems.map(({ href }) => href), "#contacto"];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>();

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 12);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth > 1088) setIsMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("resize", closeOnDesktop);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("resize", closeOnDesktop);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const sections = observedSections
      .map((href) => document.querySelector(href))
      .filter((section): section is Element => section !== null);

    if (!("IntersectionObserver" in window) || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) setActiveSection(visibleSection.target.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.2, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`site-header${isScrolled ? " is-scrolled" : ""}`}>
      <div className="container header-inner">
        <a className="brand" href="#inicio" aria-label="Rubén Palomo, volver al inicio">
          <span className="brand-mark" aria-hidden="true">
            <Image src="/images/ruben-palomo-avatar.jpg" alt="" width={240} height={240} priority />
          </span>
          <span className="brand-copy">
            <strong>Rubén Palomo</strong>
            <span>Software para negocios</span>
          </span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="site-navigation"
          aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`site-navigation${isMenuOpen ? " is-open" : ""}`}
          id="site-navigation"
          aria-label="Navegación principal"
        >
          {navigationItems.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              aria-current={activeSection === href.slice(1) ? "true" : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a
            className="nav-cta"
            href="#contacto"
            aria-current={activeSection === "contacto" ? "true" : undefined}
            onClick={() => setIsMenuOpen(false)}
          >
            Contacto
          </a>
        </nav>
      </div>
    </header>
  );
}
