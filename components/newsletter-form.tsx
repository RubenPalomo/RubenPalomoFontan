"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type Status = { message: string; type: "pending" | "success" | "error" } | null;

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      consent: formData.get("consent") === "on",
      source: window.location.href,
    };

    setIsPending(true);
    setStatus({ message: "Enviando suscripción...", type: "pending" });

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Newsletter request failed");

      form.reset();
      setStatus({ message: "Suscripción guardada. Gracias por apuntarte.", type: "success" });
    } catch {
      setStatus({
        message: "No se ha podido enviar ahora mismo. Escríbeme a ruben.palomof@gmail.com y te apunto manualmente.",
        type: "error",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="newsletter-form" id="newsletter-form" aria-describedby="newsletter-note" onSubmit={handleSubmit}>
      <div className="form-heading">
        <span>Apúntate</span>
        <p>Recibe la próxima edición</p>
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="newsletter-name">Nombre</label>
          <input id="newsletter-name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="newsletter-email">Email</label>
          <input id="newsletter-email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field field-full">
          <label htmlFor="newsletter-company">
            Empresa <span>(opcional)</span>
          </label>
          <input id="newsletter-company" name="company" type="text" autoComplete="organization" />
        </div>
      </div>

      <label className="consent-field" htmlFor="newsletter-consent">
        <input id="newsletter-consent" name="consent" type="checkbox" required />
        <span>
          Acepto recibir información sobre ofertas, automatización, productividad e inteligencia artificial aplicada.
        </span>
      </label>

      <button className="button button-primary form-submit" type="submit" disabled={isPending}>
        {isPending ? "Enviando" : "Apuntarme"} <span aria-hidden="true">→</span>
      </button>
      <p className="form-note" id="newsletter-note">
        Al enviar el formulario, tus datos se guardarán de forma privada para gestionar la newsletter. No se publican en
        la web.
      </p>
      <p className="form-status" role="status" aria-live="polite" data-status={status?.type}>
        {status?.message}
      </p>
    </form>
  );
}
