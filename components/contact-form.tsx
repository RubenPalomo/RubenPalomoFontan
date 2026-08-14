"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { siteConfig } from "@/lib/site";

export function ContactForm() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    const subject = `Proyecto de ${projectType} — ${name}`;
    const body = [
      "Hola Rubén,",
      "",
      `Soy ${name}${company ? `, de ${company}` : ""}.`,
      `Mi email de contacto es ${email}.`,
      `Tipo de proyecto: ${projectType}.`,
      "",
      "Contexto del proyecto:",
      message,
      "",
      "Gracias.",
    ].join("\n");

    setStatus(`Correo preparado. Si no se abre tu aplicación, escríbeme directamente a ${siteConfig.email}.`);
    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form
      className="contact-form"
      id="contact-form"
      action={`mailto:${siteConfig.email}`}
      method="post"
      encType="text/plain"
      aria-describedby="form-note"
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

      <button className="button button-primary form-submit" type="submit">
        Preparar correo <span aria-hidden="true">↗</span>
      </button>
      <p className="form-note" id="form-note">
        Al continuar se abrirá tu aplicación de correo con el mensaje preparado. Esta web no almacena ni envía tus datos
        a terceros.
      </p>
      <p className="form-status" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
