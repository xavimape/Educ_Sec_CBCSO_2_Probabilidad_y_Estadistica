# Publicación

El sitio es 100 % estático. Lo que se publica es la carpeta **`dist/`**, generada con `npm run build`. No hay backend, cuentas ni llamadas a servidores.

## 1. GitHub Pages (configuración recomendada)

El repositorio es `Educ_Sec_CBCSO_2_Probabilidad_y_Estadistica`, así que la URL pública será:

`https://<tu-usuario>.github.io/Educ_Sec_CBCSO_2_Probabilidad_y_Estadistica/`

Pasos:

1. Creá el repositorio **`Educ_Sec_CBCSO_2_Probabilidad_y_Estadistica`** en GitHub.
2. Subí este proyecto a `main` (todo el contenido, incluye `src/`, `public/`, `docs/`, `scripts/`, `tests/` y `.github/`).
3. En el repo: **Settings → Pages → Build and deployment → Source** elegí **GitHub Actions**.
4. El flujo `.github/workflows/deploy.yml` ya está listo: compila con `BASE_PATH` y publica `dist/`.
5. En 1–2 minutos el sitio queda en la URL de arriba.

> El flujo usa `npm ci` (requiere `package-lock.json`, que ya está). Si actualizás dependencias, subí el lockfile.

## 2. Netlify, Cloudflare Pages o Vercel

Todas construyen desde el código y sirven en raíz (sin subruta):

| Plataforma | Build command | Publish directory |
| --- | --- | --- |
| Netlify | `npm run build` | `dist` |
| Cloudflare Pages | `npm run build` | `dist` |
| Vercel | `npm run build` | `dist` |

En estos hosts **no** se define `BASE_PATH` (queda `/`). El framework Astro se detecta automáticamente.

## 3. Verificación posterior

- Abrí la URL y comprobá que cargan: portada, lecciones, práctica, laboratorio y simulacro.
- Entrá a un ejercicio (`/practica/g4-05/`) y comprobá que el `Comprobar` funciona (verifica que el CSP no bloqueó la hidratación).
- Abrí una lección y una actividad interactiva a 320 px.
- Probá «agregar a inicio» (PWA) si el navegador lo permite.

## 4. Qué NO subir

`node_modules/`, `dist/`, `.astro/`, `.env` y cualquier captura o dato personal. El `.gitignore` ya los excluye. El material del aula y los datos personales no forman parte de este repositorio.

## 5. Notas de seguridad

- La CSP bloquea scripts de **otros orígenes**, `eval` y objetos; permite scripts y estilos inline porque **Astro los inyecta para hidratar las islas** (y no hay contenido de usuario que pueda inyectar scripts: la importación de progreso rechaza HTML). Permite `data:`/`blob:` para imágenes.
- `frame-ancestors` no funciona en una meta tag: si se requiere protección contra iframes, usar un host que permita configurar cabeceras HTTP.
