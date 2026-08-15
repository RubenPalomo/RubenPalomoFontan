import type { ReactNode } from "react";
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from "react-email";

type EmailLayoutProps = {
  preview: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
};

type EmailFieldProps = {
  label: string;
  children: ReactNode;
};

export function EmailLayout({ preview, eyebrow, title, children }: EmailLayoutProps) {
  return (
    <Html lang="es">
      <Head />
      <Body style={styles.body}>
        <Preview>{preview}</Preview>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.brand}>RUBÉN PALOMO</Text>
            <Text style={styles.eyebrow}>{eyebrow}</Text>
            <Heading style={styles.heading}>{title}</Heading>
          </Section>
          <Section style={styles.content}>{children}</Section>
          <Text style={styles.footer}>Desarrollo web · Software · Automatización · IA</Text>
        </Container>
      </Body>
    </Html>
  );
}

export function EmailField({ label, children }: EmailFieldProps) {
  return (
    <Section style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{children}</Text>
    </Section>
  );
}

export function formatEmailDate(isoDate: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Madrid",
  }).format(new Date(isoDate));
}

export const emailContentStyles = {
  intro: {
    color: "#36504f",
    fontSize: "16px",
    lineHeight: "26px",
    margin: "0 0 24px",
  },
  message: {
    backgroundColor: "#f5f4ee",
    border: "1px solid #d5d8d2",
    borderRadius: "12px",
    color: "#102a2a",
    fontSize: "15px",
    lineHeight: "25px",
    margin: "8px 0 24px",
    padding: "18px 20px",
  },
  link: {
    color: "#b54f34",
    textDecoration: "none",
  },
  meta: {
    color: "#6b7d7b",
    fontSize: "12px",
    lineHeight: "20px",
    margin: "24px 0 0",
  },
};

const styles = {
  body: {
    backgroundColor: "#f5f4ee",
    color: "#102a2a",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
    margin: 0,
    padding: "32px 12px",
  },
  container: {
    backgroundColor: "#ffffff",
    border: "1px solid #d5d8d2",
    borderRadius: "18px",
    margin: "0 auto",
    maxWidth: "600px",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#174e4a",
    padding: "28px 32px 30px",
  },
  brand: {
    color: "#b9d9ce",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "2px",
    margin: "0 0 28px",
  },
  eyebrow: {
    color: "#b9d9ce",
    fontSize: "13px",
    fontWeight: "600",
    margin: "0 0 8px",
  },
  heading: {
    color: "#ffffff",
    fontSize: "28px",
    lineHeight: "34px",
    margin: 0,
  },
  content: {
    padding: "30px 32px 18px",
  },
  field: {
    borderBottom: "1px solid #e4e5df",
    padding: "0 0 14px",
  },
  label: {
    color: "#6b7d7b",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    margin: "14px 0 4px",
    textTransform: "uppercase" as const,
  },
  value: {
    color: "#102a2a",
    fontSize: "15px",
    lineHeight: "23px",
    margin: 0,
    wordBreak: "break-word" as const,
  },
  footer: {
    color: "#6b7d7b",
    fontSize: "11px",
    lineHeight: "18px",
    margin: 0,
    padding: "0 32px 28px",
    textAlign: "center" as const,
  },
};
