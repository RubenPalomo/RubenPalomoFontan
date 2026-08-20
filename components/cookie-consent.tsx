"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ruben-palomo-cookie-consent-v1";
const CONSENT_MAX_AGE = 365 * 24 * 60 * 60 * 1000;

type ConsentChoice = "accepted" | "rejected";
type StoredConsent = {
  choice: ConsentChoice;
  updatedAt: number;
};

type GoogleAnalyticsWindow = Window & {
  gtag?: (command: "consent", action: "update", parameters: Record<string, "granted" | "denied">) => void;
};

let clarityInitialization: Promise<void> | undefined;

function getStoredConsent(): ConsentChoice | null {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) return null;

    const consent = JSON.parse(storedValue) as Partial<StoredConsent>;
    if (consent.choice !== "accepted" && consent.choice !== "rejected") {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    const isCurrent = typeof consent.updatedAt === "number" && Date.now() - consent.updatedAt < CONSENT_MAX_AGE;

    if (!isCurrent) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return consent.choice;
  } catch {
    return null;
  }
}

function storeConsent(choice: ConsentChoice) {
  const consent: StoredConsent = { choice, updatedAt: Date.now() };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // El consentimiento sigue funcionando durante la visita aunque el navegador bloquee el almacenamiento local.
  }
}

function updateGoogleAnalyticsConsent(choice: ConsentChoice) {
  const gtag = (window as GoogleAnalyticsWindow).gtag;
  if (typeof gtag !== "function") return;

  gtag("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: choice === "accepted" ? "granted" : "denied",
  });
}

async function initializeClarity(choice: ConsentChoice | null) {
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;

  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim() || "y5aq9f9gy8";

  clarityInitialization ??= import("@microsoft/clarity")
    .then(({ default: Clarity }) => {
      Clarity.init(projectId);
    })
    .catch(() => {
      clarityInitialization = undefined;
    });

  await clarityInitialization;

  const { default: Clarity } = await import("@microsoft/clarity");
  const analyticsStorage = choice === "accepted" ? "granted" : "denied";

  Clarity.consentV2({ ad_Storage: "denied", analytics_Storage: analyticsStorage });
  if (choice !== "accepted") Clarity.consent(false);
}

export function CookieConsent() {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const initializationId = window.setTimeout(() => {
      const storedChoice = getStoredConsent();
      setChoice(storedChoice);
      setIsOpen(storedChoice === null);
      setIsReady(true);

      void initializeClarity(storedChoice);
    }, 0);

    return () => window.clearTimeout(initializationId);
  }, []);

  async function acceptAnalytics() {
    storeConsent("accepted");
    setChoice("accepted");
    setIsOpen(false);
    updateGoogleAnalyticsConsent("accepted");
    await initializeClarity("accepted");
  }

  async function rejectAnalytics() {
    const hadAccepted = choice === "accepted";

    storeConsent("rejected");
    setChoice("rejected");
    setIsOpen(false);
    updateGoogleAnalyticsConsent("rejected");

    try {
      await initializeClarity("rejected");
    } finally {
      if (hadAccepted) window.location.reload();
    }
  }

  if (!isReady) return null;

  return (
    <>
      {isOpen ? (
        <section className="cookie-consent" aria-labelledby="cookie-consent-title" aria-live="polite">
          <div className="cookie-consent-copy">
            <p className="cookie-consent-label">Cookies</p>
            <h2 id="cookie-consent-title">Tu privacidad es importante</h2>
            <p>
              Utilizamos medición básica para conocer las visitas y, si aceptas, cookies analíticas para mejorar la web.{" "}
              <a href="/cookies">Más información</a>.
            </p>
          </div>
          <div className="cookie-consent-actions">
            <button className="cookie-consent-action" type="button" onClick={() => void rejectAnalytics()}>
              Rechazar
            </button>
            <button className="cookie-consent-action" type="button" onClick={() => void acceptAnalytics()}>
              Aceptar
            </button>
          </div>
        </section>
      ) : (
        <button className="cookie-settings-trigger" type="button" onClick={() => setIsOpen(true)}>
          Configurar cookies
        </button>
      )}
    </>
  );
}
