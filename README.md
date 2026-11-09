# Estadística y Probabilidad · 2.º año

Sitio web estático para consultar, aprender, repasar y practicar Estadística y Probabilidad del segundo año de secundaria. Desplegable en GitHub Pages, Netlify, Cloudflare Pages o Vercel (un build por `base`).

**Estado:** fase 1 (esqueleto). Ver [`docs/ESTADO.md`](docs/ESTADO.md). La propuesta completa vive en [`DeepSeek_Harness/06_PROPUESTA_NUEVO_PROYECTO/`](../DeepSeek_Harness/06_PROPUESTA_NUEVO_PROYECTO/INDICE.md).

## Stack

Astro (SSG) + React (islands) + TypeScript. Motor matemático en `src/lib/math/` (puro, sin `eval`), pruebas con Vitest y Playwright.

## Comandos

```bash
npm install            # requiere Node >= 22.23
npm run dev            # desarrollo local
npm test               # pruebas unitarias del motor
npm run validate:content   # integridad del banco de ejercicios
npm run migrate:bank       # migra las 84 actividades heredadas a JSON
npm run build          # genera dist/ (BASE_PATH opcional para subruta)
npm run preview        # sirve dist/ localmente

# E2E: una sola vez, descarga el navegador de Playwright
npx playwright install chromium
npm run test:e2e       # smoke test de navegación
```

## Publicación

- **GitHub Pages:** `BASE_PATH=/Educ_Sec_CBCSO_2_Probabilidad_y_Estadistica/ npm run build`, publicar `dist/` (incluye `.nojekyll`).
- **Netlify / Cloudflare / Vercel:** build `astro build`, publicar `dist` (sin `BASE_PATH`).

## Estructura

```text
src/
  content/             # lecciones (md), ejercicios (json), glosario (json)
  lib/math/            # motor matemático
  lib/content/         # esquemas Zod
  components/          # islas React (en la continuación de F1)
  pages/               # rutas por archivo
tests/unit/            # pruebas del motor
scripts/               # validación de contenido
```

## Notas de fase 1

- Las versiones del `package.json` son puntos de partida; se ajustan al ejecutar `npm install`.
- `package-lock.json` ya fue generado por la primera instalación local; el CI usa `npm ci`.
- La configuración de colecciones (`src/content.config.ts`) apunta a Astro 5.
- Convención de moda: la serie es amodal cuando todas las frecuencias son iguales; si no, la moda es el valor (o valores) de mayor frecuencia.
- El contenido de ejemplo (1 lección, 1 ejercicio, 1 glosario) es para validar el pipeline; se reemplaza en la fase 2.
