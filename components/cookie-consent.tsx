"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ruben-palomo-cookie-consent-v1";
const CONSENT_MAX_AGE = 365 * 24 * 60 * 60 * 1000;

type ConsentChoice = "accepted" | "rejected";
type StoredConsent = {
  choice: ConsentChoice;
  updatedAt: number;
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

async function initializeClarity() {
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;

  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim() || "y5aq9f9gy8";

  clarityInitialization ??= import("@microsoft/clarity")
    .then(({ default: Clarity }) => {
      Clarity.init(projectId);
      Clarity.consentV2({ ad_Storage: "denied", analytics_Storage: "granted" });
    })
    .catch(() => {
      clarityInitialization = undefined;
    });

  await clarityInitialization;
}

async function withdrawClarityConsent() {
  if (!document.getElementById("clarity-script")) return;

  const { default: Clarity } = await import("@microsoft/clarity");
  Clarity.consentV2({ ad_Storage: "denied", analytics_Storage: "denied" });
  Clarity.consent(false);
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

      if (storedChoice === "accepted") void initializeClarity();
    }, 0);

    return () => window.clearTimeout(initializationId);
  }, []);

  async function acceptAnalytics() {
    storeConsent("accepted");
    setChoice("accepted");
    setIsOpen(false);
    await initializeClarity();
  }

  async function rejectAnalytics() {
    const hadAccepted = choice === "accepted";

    storeConsent("rejected");
    setChoice("rejected");
    setIsOpen(false);

    try {
      await withdrawClarityConsent();
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
            <p className="cookie-consent-label">Tu privacidad</p>
            <h2 id="cookie-consent-title">¿Aceptas las cookies analíticas?</h2>
            <p>
              Microsoft Clarity permite conocer visitas e interacciones mediante estadísticas, mapas de calor y
              grabaciones de sesión. Los formularios están enmascarados y no habilitamos almacenamiento publicitario.{" "}
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
