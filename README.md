# Web profesional de Rubén Palomo

Migración a Next.js de la web profesional de Rubén Palomo. Conserva el contenido, la identidad
visual, los assets, el SEO, la accesibilidad, el formulario de contacto por `mailto:` y la
newsletter con notificación privada por Telegram.

## Stack

- Next.js 16 con App Router.
- React 19 y TypeScript estricto.
- Server Components por defecto.
- CSS propio, sin librerías visuales ni fuentes externas.
- Route Handler para `POST /api/newsletter`.

## Desarrollo local

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Variables de entorno

Copia `.env.example` como `.env.local` y configura:

- `TELEGRAM_TOKEN`: token del bot que recibe las altas de newsletter.
- `TELEGRAM_ID`: identificador del chat de Telegram destinatario.
- `NEXT_PUBLIC_SITE_URL`: URL pública absoluta. Es opcional; si no se define, se utiliza
  `https://rubenpalomo.vercel.app/`.

No deben incluirse valores reales en el repositorio.

## Validación

```bash
npm run lint
npm run typecheck
npm run build
```

## Despliegue en Vercel

1. Importa `RubenPalomo/RubenPalomoFontan` en Vercel.
2. Mantén el preset de framework Next.js y los comandos detectados automáticamente.
3. Añade `TELEGRAM_TOKEN` y `TELEGRAM_ID` a Production, Preview y Development según proceda.
4. Si el dominio definitivo cambia, configura `NEXT_PUBLIC_SITE_URL` con la URL canónica y vuelve
   a desplegar.

Next.js genera de forma nativa los metadatos, `/robots.txt` y `/sitemap.xml`. La URL canónica,
Open Graph, Twitter Card y JSON-LD se centralizan en `lib/site.ts`.
