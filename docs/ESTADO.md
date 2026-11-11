# Estado del proyecto

Único documento vivo de estado. Reemplaza la costumbre del proyecto anterior de mantener varios documentos superpuestos.

**Fecha:** 9 de noviembre de 2026. **Estado:** F1–F4 completas. **Publicado** en https://xavimape.github.io/Educ_Sec_CBCSO_2_Probabilidad_y_Estadistica/

## 1. Decisiones cerradas (fase 0)

| Punto | Valor |
| --- | --- |
| Hosting | Estático gratuito: GitHub Pages, Netlify, Cloudflare Pages, Vercel |
| Stack | Astro + React + TypeScript; Vitest y Playwright |
| Routing | Por archivo, con trailing slash |
| Repo | `Educ_Sec_CBCSO_2_Probabilidad_y_Estadistica` |
| Alcance | 8 módulos, con Probabilidad como ampliación curricular |
| Offline | PWA; sin modo `file://` |
| Herencia | Motor, banco de 84 y fichas reutilizados, marcados «a re-verificar» |

Detalle y motivos: [propuesta](../../DeepSeek_Harness/06_PROPUESTA_NUEVO_PROYECTO/INDICE.md).

## 2. Qué existe hoy

| Bloque | Estado |
| --- | --- |
| Configuración + CI | Verificado con Node 26: `check` 0 errores, build OK |
| Motor matemático | Portado y validado; reglas de entrada y convención de moda |
| Corrector | `src/lib/corrector.ts`: compara respuestas por tipo (no autocorrige rúbrica/tabla/barras) |
| Vista de práctica | `Ejercicio.tsx` + `practica/[id].astro` + `practica/index.astro` |
| Laboratorio | `Laboratorio.tsx` + `laboratorio.astro` (datos → tabla → gráfico → medidas, comparador de extremos) |
| Simulacro | `Simulacro.tsx` + `simulacro.astro` (8/12 ejercicios con semilla, devolución al final) |
| Progreso local | `lib/storage.ts` (intentos, favoritos, «para repasar», exportar/importar) + integración en `Ejercicio.tsx` |
| PWA | `public/sw.js` (caché runtime), `sw-registro.js`, `manifest.webmanifest`, `icon.svg` |
| Esquemas + validación | Zod compartido entre colecciones, validación CLI y test |
| Banco | **104 ejercicios** (84 heredadas + 20 nuevas) en `src/content/ejercicios/*.json` |
| Lecciones | **M1–M8** en `src/content/lecciones/` (8 archivos `.md`) |
| Páginas | Portada + índice de lecciones + **ruta de detalle `[slug]`** + 2 actividades |
| Componentes | `BarrasBuilder.tsx` y `ArbolProbabilidad.tsx` (spikes de F1) |
| Pruebas | Unitarias (motor + contenido) y E2E (smoke + 2 actividades) |
| Documentación | `MAPA_DE_CONTENIDOS.md` (via `npm run resumen`) y `AUDITORIA_DEL_BANCO.md` |

## 3. Correcciones aplicadas el 9/11

Resumen de las 8 correcciones de la [auditoría inicial](AUDITORIA_INICIAL_2026-11-09.md), con análisis en [A03](../../DeepSeek_Harness/03_AUDITORIAS/A03_2026-11-09_ANALISIS_DE_LA_AUDITORIA_INICIAL.md): CI reproducible, navegación relativa, validación del motor, convención de moda, G4-05 completo, contraste AA, validación Zod del banco y `playwright.config.ts` con su propio `testDir`.

## 4. Qué falta para cerrar F4

- **Verificar la CSP** (agregada el 9/11): correr `check`/`build`/`test:e2e` y confirmar que la hidratación no se rompió.
- **Publicar** (acción del usuario): crear el repo y activar Pages, según `docs/PUBLICACION.md`.
- **Recálculo residual** de las partes que `auditar:banco` no cubre (frecuencias específicas, relativa/porcentual): baja prioridad.

## 5. Estado de F4

- Fichas y PDF públicos: copiados a `public/fichas/` y `public/documentos/`.
- Actualización Astro → 7.4.7 y zod → 4.6.7: aplicada sin novedad; lockfile actualizado.
- `auditar:banco`: sin discrepancias.
- CSP y flujo de despliegue: agregados (ver `docs/PUBLICACION.md`). CSP ajustada a `script-src 'self' 'unsafe-inline'` (Astro inyecta scripts inline para hidratar las islas).
- C14: resuelto (suma 260, media 6,5, moda 8; ver A03).
- Pendiente: crear el repositorio remoto y publicar.

## 6. Módulos (M1–M8)

| Módulo | Lección | Fuente principal de datos |
| --- | --- | --- |
| M1 | Dato, variable y frecuencia | mascotas `1, 2, 1, 0, 2, 1` |
| M2 | Tablas de frecuencias | libros `n = 20`, `f = 3, 8, 6, 2, 1` |
| M3 | Gráficos | colores `12, 8, 6, 4`; 25 % → 90° |
| M4 | Media, mediana y moda | G4-05 (suma 127) y estaturas (mediana 171) |
| M5 | Elección de medida | sueldos (media 800.000, mediana 300.000) |
| M6 | Azar y espacio muestral | moneda y dado |
| M7 | Conteo y probabilidad | dos monedas → P = 3/4 |
| M8 | Comunicación y lectura crítica | CEAMSE (6.200 + 10.800) |

## 7. Fase visual (10/11/2026, en curso)

- **Cambio A · Íconos PWA**: `scripts/generar-iconos.mjs` (+ `npm run iconos`) genera `icon-192.png`, `icon-512.png` y `icon-maskable-512.png` desde `icon.svg`; manifest y `apple-touch-icon` actualizados.
- **Cambio B · Estilos globales**: `global.css` con tokens (colores AA verificados, tipografía y espaciado), `:focus-visible` y medida de lectura `68ch`; se conserva la protección de 320 px.
- **Inventario paralelo**: `npm run inventario` genera `docs/REVISION_MANUAL.md` con los ejercicios que `auditar:banco` no cubre.
- **Paso 2 · Componentes de interacción**: inputs/selects/textarea con borde `--color-borde` y radio 6 px; botones con hover/elevación y deshabilitado; feedback con borde y colores AA (`--color-ok`, `--color-error`).
- **Paso 3 · Tarjetas**: portada (módulos enlazados a cada lección) y lecciones en grilla de tarjetas (`.tarjetas`/`.tarjeta` en `global.css`).
- **Ajustes 3.1/3.2 (11/11)**: tarjetas con `padding` 1.5 rem y margen superior 2 rem; jerarquía tipográfica en `.leccion-contenido` (h1 2 rem, h2 1.5 rem, h3 1.25 rem, p con margen y `line-height` 1.6).
- **Ajuste H1 (11/11)**: el título de la lección se movió dentro de `.leccion-contenido` (Opción A), con márgenes consistentes con la jerarquía.
- **Fase 5 (preparación)**: componentes `Acordeon`, `Tabs` y `Colapsable` (React + `useState`, sin librerías externas) y página de vista previa `/componentes/`.
- **Corrección de Tabs (11/11)**: el foco ahora acompaña a la selección al usar las flechas (`useRef` + `.focus()`), cerrando el bug detectado por Codex en `2ffa1b7`.
- **Verificado (local, usuario)**: íconos generados y `check`/`build`/`test`/`test:e2e` en verde.
- **Inventario**: 104 total, 15 auto-verificados, **89** para revisión manual (diferencia con los 85 de Codex: incluye numéricos sin parte medible).
- **Pendiente**: verificar build/E2E del ajuste H1 y de la vista previa; Antigravity valida accesibilidad (teclado, `aria-expanded`) y 320 px.

## 8. Fase 6A · Offline íntegro (11/11)

- **Precache generado en build**: `scripts/generar-precache.mjs` (se ejecuta tras `astro build`) escribe `dist/sw-precache.js` con los HTML y assets (excluye `fichas/`, `documentos/` y los archivos del SW).
- **Fallback explícito**: `sw.js` importa la lista generada y sirve `./offline/` en navegación sin red, en lugar de la portada bajo otra URL.
- **Aviso de hidratación**: `Ejercicio`, `Barras`, `Árbol` y `Simulacro` muestran un aviso visible mientras no hidrataron; se mantiene `disabled={!listo}`.
- **Cerrada**: validada por Antigravity y Codex y desplegada en `55c9dab`.

## 9. Fase 6B · SVG interactivas (11/11)

- `GraficoCircular.tsx` (M2), `Histograma.tsx` (M3) y `ArbolNodos.tsx` (M7): SVG puro con `viewBox`, `title`/`desc` y `width: 100%`.
- Árbol con nodos `<g tabindex="0" role="button">` (Enter/Espacio) y probabilidad al enfocar.
- Vista previa en `/actividades/graficos/`.
- **Correcciones (11/11)**: circular al 100 % dibuja disco completo; histograma con escala dinámica (`Math.max`); integración de los tres SVG en M2/M3/M7 con enlace a la actividad.
- **Cerrada**: corregida en `4154032`; validada por Antigravity y Codex en producción.

## 10. Fase 7 · Micro-interacciones (11/11)

- Hover de tarjetas con elevación (`transform: translateY(-2px)`, `transition: 0.2s`).
- Fade-in del contenido (`@keyframes fadeIn` aplicado a `main`).
- Shake sutil en `.feedback.error`.
- `@media (prefers-reduced-motion: reduce)` desactiva todas las animaciones y transiciones.
- **Corrección (11/11)**: en `prefers-reduced-motion` se anula también el `transform` de las tarjetas (`transform: none`), cerrando la observación de Codex.
- **Pendiente**: verificar build/E2E y validar `prefers-reduced-motion` (Antigravity).

## 11. Fase 8 · Hero + header sticky (11/11)

- `Encabezado.astro`: header sticky con marca y navegación (Inicio/Lecciones/Practicar), incluido en `Layout.astro`.
- `Hero.astro`: título, subtítulo, descripción, botones «Empezar a practicar» y «Ver lecciones», e icono SVG decorativo.
- Estilos en `global.css` (degradado sutil, radio 12 px, AA en botones).
- **Cerrada**: validada por Antigravity y Codex en producción (`f6ecc80`).

## 12. Fase 9 · Tarjetas con iconos (11/11)

- Iconos SVG en las tarjetas de módulos y en las tarjetas de acciones (Practicar, Laboratorio, Simulacro), con `aria-hidden="true"`.
- `.tarjeta > a`: radio 12 px, hover `translateY(-4px)`, sombra `0 4px 12px`, borde de acento.
- Jerarquía interna: `.tarjeta-titulo` (600, 1.1 rem), `.tarjeta-desc` (#64748b) y `.tarjeta-ir` («Ver lección →» / «Ir →»).
- `prefers-reduced-motion` ya anula el `transform` de las tarjetas.
- **Pendiente**: verificar build/E2E y validar 320 px/AA/teclado (Antigravity).

## 13. Fase 10 · Paleta y tipografía (11/11)

- `--color-fondo` pasa a `#fafbfc`; se agrega `--color-secundario: #0f766e` (teal-700, blanco encima = 5,47:1).
- `.tarjeta-modulo` pasa a pill teal con texto blanco.
- `.leccion-contenido h1` con `letter-spacing: -0.01em`; `--max-lectura: 68ch` confirmado en `main`.
- Font-stack del sistema (sin fuentes externas, para no romper offline).
- **Cerrada**: validada por Antigravity y Codex en producción (`f6c6559`).

## 14. Fase 11 · Migas de pan y skip link (11/11)

- `Migas.astro`: `<nav aria-label="Migas de pan">` con `<ol>`, separadores `aria-hidden` y página actual en `<span aria-current="page">`.
- Migas en: lecciones (índice y lección), práctica (índice y ejercicio), laboratorio, simulacro, actividades/gráficos y componentes.
- `skip-link` «Saltar al contenido» en `Layout.astro` → `#contenido`.
- Estilos `.migas` y `.skip-link` en `global.css` (con wrap a 320 px).
- **Cerrada**: validada por Antigravity y Codex en producción (`21dc93a`).

## 15. Fase 12A · Modo oscuro automático (11/11)

- Tokens nuevos (`--color-superficie`, `--color-tinta-suave`, `--color-encabezado`, `--hero-grad-*`) y bloque `@media (prefers-color-scheme: dark)` que redefine fondo/superficie/tinta/borde/acento/ok/error/secundario.
- Componentes y SVG ya no usan hex de modo claro: superficies, grises, botones, pill y gráficos pasan a tokens.
- `theme-color` con variante clara y oscura.
- Sin toggle manual (eso sería Fase 12B).
- **Fase 12A.1 (11/11)**: `color-scheme: light dark` en `html` y `background`/`color` con tokens en `input`/`select`/`textarea`, para que los controles nativos acompañen el tema oscuro.
- **Pendiente**: verificar build/E2E y validar contraste AA/≥3:1 en oscuro (Antigravity).

## 16. Fase 13 · Impresión accesible (11/11)

- `print.css` importado en `Layout.astro`: `@page` con márgenes de 2 cm, tipografía 12 pt e interlineado 1,5.
- Oculta solo elementos de pantalla (skip link, header, migas, botones, inputs, aviso de hidratación, feedback, pestañas).
- Evita cortes: `break-inside: avoid` en tarjetas/ejercicios/SVG/tablas y `break-after: avoid` en encabezados.
- Sin JavaScript, dependencias ni rutas nuevas.
- **Fase 13.1 (11/11)**: resúmenes `.solo-impresion` en circular (categoría/frecuencia/relativa/%), histograma (intervalo/frecuencia) y árbol (rutas y P); `.bloque-impresion` con `break-inside: avoid`; paleta de papel forzada en `@media print` (fondo/superficie blancos, tinta negra, SVG y enlaces negros), incluso si la pantalla está en oscuro.
- **Fase 13.2 (11/11)**: `color-scheme: light` en `:root` de impresión; `html`/`body` con blanco/negro `!important`; hero neutralizado; enlaces negros subrayados. Robustece la impresión con fondos activados desde tema oscuro.
- **Fase 13.3 (11/11)**: en impresión, `pre` y sus `code`/`span` (Shiki) pasan a fondo blanco, texto negro, borde gris, `white-space: pre-wrap` y `overflow-wrap: anywhere`; vence los estilos inline del tema oscuro.
- **Pendiente**: verificar build/E2E y validar los PDF en claro y oscuro (Antigravity).

## 17. Fase 14 · Kit didáctico (11/11)

- Tokens semánticos AA `--concepto-cualitativo` (ámbar), `--concepto-cuantitativo` (azul) y `--concepto-medida` (verde), con variantes oscuras.
- Componentes `PasosConstruccion` (pasos numerados), `Comparativa` (❌/✅) y `AlertaConcepto` (`role="note"`).
- `kit.css` con `.paso-numero`, `.comparativa`, `.alerta-concepto` y `.fondo-cuadricula`.
- Vista previa en `/componentes/`.
- **Pendiente**: verificar build/E2E y validar AA/320 px/teclado (Antigravity).
