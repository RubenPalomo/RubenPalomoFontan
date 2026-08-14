# Web profesional de Rubén Palomo

Migración a Next.js de la web profesional de Rubén Palomo. Conserva el contenido, la identidad
visual, los assets, el SEO, la accesibilidad, el formulario de contacto por `mailto:` y la
newsletter con persistencia privada en MongoDB.

## Stack

- Next.js 16 con App Router.
- React 19 y TypeScript estricto.
- Server Components por defecto.
- CSS propio, sin librerías visuales ni fuentes externas.
- Route Handler para `POST /api/newsletter`.
- Driver oficial de MongoDB con conexión reutilizable.

## Desarrollo local

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Variables de entorno

Copia `.env.example` como `.env.local` y configura:

- `MONGODB_URI`: cadena de conexión privada de MongoDB. La aplicación guarda las altas en la base
  `ruben_palomo`, colección `newsletter_subscribers`.
- `NEXT_PUBLIC_SITE_URL`: URL pública absoluta. Es opcional; si no se define, se utiliza
  `https://rubenpalomo.vercel.app/`.

No deben incluirse valores reales en el repositorio.

## Validación

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

Para aplicar correcciones automáticas de formato y lint se pueden usar `npm run format` y
`npm run lint-fix`.

## Despliegue en Vercel

1. Importa `RubenPalomo/RubenPalomoFontan` en Vercel.
2. Mantén el preset de framework Next.js y los comandos detectados automáticamente.
3. Añade `MONGODB_URI` a Production, Preview y Development según proceda. El usuario de MongoDB
   debe tener permisos de lectura y escritura y el clúster debe aceptar conexiones desde Vercel.
4. Si el dominio definitivo cambia, configura `NEXT_PUBLIC_SITE_URL` con la URL canónica y vuelve
   a desplegar.

Next.js genera de forma nativa los metadatos, `/robots.txt` y `/sitemap.xml`. La URL canónica,
Open Graph, Twitter Card y JSON-LD se centralizan en `lib/site.ts`.
