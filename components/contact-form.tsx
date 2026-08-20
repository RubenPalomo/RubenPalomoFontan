"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { buildContactMailtoUrl } from "@/lib/contact-mailto";
import { trackClarityEvent } from "@/lib/clarity-events";
import { siteConfig } from "@/lib/site";

type Status = { message: string; type: "pending" | "success" | "error" } | null;

export function ContactForm() {
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
    const name = String(formData.get("name") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const projectType = String(formData.get("project-type") || "").trim();
    const message = String(formData.get("message") || "").trim();

    setIsPending(true);
    setStatus({ message: "Enviando consulta...", type: "pending" });

    const openEmailFallback = () => {
      const mailtoUrl = buildContactMailtoUrl(siteConfig.email, { name, company, email, projectType, message });
      trackClarityEvent("contact_email_fallback");
      setStatus({
        message: "Resend no está disponible. He abierto tu aplicación de correo con el mensaje preparado.",
        type: "success",
      });
      window.location.href = mailtoUrl;
    };

    try {
      let response: Response;
      try {
        response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submissionId: crypto.randomUUID(),
            name,
            company,
            email,
            projectType,
            message,
          }),
        });
      } catch {
        openEmailFallback();
        return;
      }

      if (response.status >= 500) {
        openEmailFallback();
        return;
      }

      if (!response.ok) throw new Error("Contact request failed");

      trackClarityEvent("contact_sent");
      form.reset();
      setStatus({ message: "Consulta enviada. Gracias, te responderé lo antes posible.", type: "success" });
    } catch {
      setStatus({
        message: `No se ha podido enviar ahora mismo. Escríbeme directamente a ${siteConfig.email}.`,
        type: "error",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      className="contact-form"
      id="contact-form"
      aria-describedby="form-note"
      data-clarity-mask="true"
      onSubmit={handleSubmit}
    >
      <div className="form-heading">
        <span>Hablemos</span>
        <p>Describe brevemente tu proyecto</p>
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Nombre</label>
          <input id="name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="company">
            Empresa <span>(opcional)</span>
          </label>
          <input id="company" name="company" type="text" autoComplete="organization" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="project-type">Tipo de proyecto</label>
          <select id="project-type" name="project-type" required defaultValue="">
            <option value="">Selecciona una opción</option>
            <option value="Desarrollo web">Desarrollo web</option>
            <option value="Software a medida">Software a medida</option>
            <option value="Automatización">Automatización</option>
            <option value="Inteligencia artificial">Inteligencia artificial</option>
            <option value="Consultoría">Consultoría</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="field field-full">
          <label htmlFor="message">Mensaje</label>
          <textarea
            id="message"
            name="message"
            rows={6}
            minLength={20}
            placeholder="¿Qué quieres mejorar, automatizar o construir?"
            required
          />
        </div>
      </div>

      <button className="button button-primary form-submit" type="submit" disabled={isPending}>
        {isPending ? "Enviando" : "Enviar consulta"} <span aria-hidden="true">↗</span>
      </button>
      <p className="form-note" id="form-note">
        Si el envío automático falla, se abrirá tu aplicación de correo con el mensaje preparado.
      </p>
      <p className="form-status" role="status" aria-live="polite" data-status={status?.type}>
        {status?.message}
      </p>
    </form>
  );
}
