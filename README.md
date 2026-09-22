# Web de la Academia SMARTER

Página pública de la academia: quiénes son, los programas, qué hace la app,
cómo descargarla (Android) y un formulario de inscripción que abre WhatsApp.

Hecha con [Astro](https://astro.build): compila a HTML estático, sin servidor.
La publica Cloudflare Pages.

## Trabajar en local

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # compila a dist/
npm run preview   # sirve dist/ para revisarlo
```

## Dónde se cambia cada cosa

| Qué | Dónde |
| --- | --- |
| Textos, teléfono, programas, preguntas, testimonios | `src/data/site.ts` |
| Enlace de descarga del APK | `app.apk` en `src/data/site.ts` |
| Colores y letra | `src/styles/global.css` (los mismos que la app) |
| Cada sección | `src/components/` |
| Dirección pública | `astro.config.mjs` (`site`) y `academia.url` |

Los datos marcados con `EJEMPLO` en `src/data/site.ts` (teléfono, cifras,
testimonios) son de muestra: se cambian por los reales antes de salir.

### Imágenes

Salen del arte de la app y del prototipo; no se editan a mano:

```sh
python scripts/preparar_imagenes.py
```

Recorta las poses de la mascota, arma los jugadores con las piezas de la
Tienda SMARTER y copia monedas, stickers y medallas a `src/assets/img/`.
Astro las pasa a WebP al compilar. Las capturas `app-perfil.png` y
`app-tienda.png` se sacan de la app.

## Publicar en Cloudflare Pages

Una sola vez:

1. Sube esta carpeta a un repositorio de GitHub (por ejemplo `landing-smarter`).
2. En Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** y
   elige el repositorio.
3. Configuración de compilación:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Variable de entorno `NODE_VERSION` = `22`
4. **Save and Deploy**. La web queda en `https://<nombre>.pages.dev`. Si el
   nombre no es `landing-smarter`, cámbialo en `astro.config.mjs` y en
   `academia.url`.

Después, cada `git push` a `main` publica solo.

Sin GitHub también se puede, subiendo lo compilado:

```sh
npm run build
npx wrangler pages deploy dist --project-name landing-smarter
```

### Dominio propio (más adelante)

En el proyecto de Pages: **Custom domains → Set up a custom domain**. Luego
cambia `site` en `astro.config.mjs` y `academia.url`.

## Publicar una versión nueva de la app

El APK (unos 27 MB) no va en esta web: Cloudflare Pages no sirve archivos de
más de 25 MB. Va en las Releases de GitHub del repositorio de la app:

1. En la app: `flutter build apk --release`.
2. Renombra `build/app/outputs/flutter-apk/app-release.apk` a `smarter.apk`.
3. En GitHub, en el repositorio de la app: **Releases → Draft a new release**,
   una etiqueta nueva (`v1.0.1`) y adjunta `smarter.apk`.

El botón de la web apunta a `releases/latest/download/smarter.apk`, que
siempre es la última versión: la web no se toca. El repositorio tiene que ser
público para que cualquiera pueda descargar, o las Releases de uno aparte que
sí lo sea. Solo hay que actualizar `app.version` en `src/data/site.ts` si se
quiere mostrar el número nuevo.

## Crecer

Para una sección nueva (materiales gratis, un portal), se crea
`src/pages/<nombre>.astro` con `<Base titulo=... >` y sus componentes; la barra
y el pie ya vienen. Si algún día hace falta lógica de servidor (formularios que
guarden en la base, login), Astro admite el adaptador de Cloudflare sin
rehacer lo que ya hay.
