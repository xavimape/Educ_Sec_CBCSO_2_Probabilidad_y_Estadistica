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
- **Verificado (local, usuario)**: íconos generados y `check`/`build`/`test`/`test:e2e` en verde.
- **Inventario**: 104 total, 15 auto-verificados, **89** para revisión manual (diferencia con los 85 de Codex: incluye numéricos sin parte medible).
- **Pendiente**: que Antigravity revalide 320 px y contraste de 3.1/3.2 y desplegar la Fase 4.
