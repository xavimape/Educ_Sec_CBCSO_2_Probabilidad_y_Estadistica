# Auditoría inicial de Probabilidad y Estadística

**9 de noviembre de 2026.** Revisión del proyecto local v0.1.0 contra los cuatro documentos de la [propuesta de DeepSeek](../../DeepSeek_Harness/06_PROPUESTA_NUEVO_PROYECTO/INDICE.md) y los [lineamientos de Cielito](../../AGENTS.md). Las instalaciones y ejecuciones se hicieron sobre una copia de trabajo.

## Dictamen

El esqueleto compila y Astro sincroniza las tres colecciones. La fase F1 sigue abierta. El [plan de aceptación](../../DeepSeek_Harness/06_PROPUESTA_NUEVO_PROYECTO/04_PLAN_DE_TRABAJO.md#1-fases) exige un piloto de M1 y M2 con una lección y 15 ejercicios por módulo, más dos actividades interactivas de prueba, una de gráfico y otra de árbol de probabilidad. El proyecto tiene una lección borrador de M1, un ejercicio de M4 y una ficha de glosario. Las únicas páginas generadas son la portada y el índice de lecciones. El banco completo, el laboratorio, el progreso local, la PWA y la publicación pertenecen a fases posteriores.

## Hallazgos

| Prioridad | Hallazgo y evidencia | Criterio de cierre |
| --- | --- | --- |
| P1 | **CI interrumpida en la instalación.** `npm ci` falla con `EUSAGE` porque el proyecto carece de `package-lock.json`. La instalación con `npm install` sí funcionó en la copia. [.github/workflows/ci.yml:16](../.github/workflows/ci.yml#L16) | Una copia limpia instala con `npm ci` y CI ejecuta las comprobaciones. |
| P1 | **Enlaces fuera de la subruta.** El HTML compilado para Pages conserva `href="/lecciones/"` en portada y `href="/"` en el índice. El navegador resuelve ambos desde la raíz del dominio. [src/pages/index.astro:18](../src/pages/index.astro#L18) · [src/pages/lecciones/index.astro:27](../src/pages/lecciones/index.astro#L27) | La ida y la vuelta funcionan con ambos valores de `BASE_PATH`. |
| P1 | **El índice no abre la lección.** Solo imprime título, módulo y objetivo. El cuerpo Markdown queda fuera del HTML y el ejercicio y el glosario carecen de acceso en la interfaz. [src/pages/lecciones/index.astro:18](../src/pages/lecciones/index.astro#L18) | Abrir la lección completa desde el índice y recorrer el piloto hasta práctica, devolución y cierre. |
| P1 | **El espacio muestral reaparece después de una etapa vacía.** `espacioMuestral([[1], [], [2]])` devuelve `[[2]]`. El producto cartesiano de esas etapas es vacío. La condición que inicia la acumulación también se activa después de haberla vaciado. [src/lib/math/probabilidad.ts:8](../src/lib/math/probabilidad.ts#L8) | Probar etapas vacías al principio, en el medio y al final, y comparar los resultados de una moneda y un dado con un fixture independiente. |
| P2 | **La comprobación de tipos falla aunque pasen las pruebas unitarias.** TypeScript rechaza `(string[] \| number[])[]` para la llamada a `espacioMuestral` del ejemplo moneda y dado. CI omite `npm run check`. [tests/unit/probabilidad.test.ts:10](../tests/unit/probabilidad.test.ts#L10) · [.github/workflows/ci.yml:17](../.github/workflows/ci.yml#L17) | Tipar el caso de etapas con valores mixtos y exigir `check` en CI. |
| P2 | **El comando E2E recoge los tests unitarios.** Playwright carga los archivos de Vitest, emite errores de estado interno y termina con `No tests found`. El proyecto carece de casos E2E. [package.json:15](../package.json#L15) | Delimitar los directorios de cada runner y ejecutar recorridos reales de raíz, subruta y actividades del piloto. |
| P2 | **El motor admite conteos inválidos.** `relativa(5,3)` devuelve 1,666…, `probabilidadClasica(1.5,6)` devuelve 0,25 y `verificarTabla([-1,3],2)` aprueba la tabla. `mediaDesdeTabla([1,5],[-1,3])` devuelve 7 y `parseDecimal('1 2')` interpreta 12. [src/lib/math/frecuencias.ts:20](../src/lib/math/frecuencias.ts#L20) · [src/lib/math/probabilidad.ts:30](../src/lib/math/probabilidad.ts#L30) · [src/lib/math/medidas.ts:38](../src/lib/math/medidas.ts#L38) · [src/lib/math/formato.ts:7](../src/lib/math/formato.ts#L7) | Definir y probar las reglas de entrada antes de conectar el motor a la corrección de ejercicios. |
| P2 | **La migración cambia la convención de moda.** Con `[2,2,3,3]` el nuevo motor devuelve dos modas. El motor anterior trata como amodal una distribución con más de un valor y todas las frecuencias iguales. [src/lib/math/medidas.ts:25](../src/lib/math/medidas.ts#L25) · [Motor anterior:437](../../web-estadistica/site/assets/js/math-engine.js#L437) | Explicitar la convención escolar y aplicarla de forma consistente en lecciones, motor y banco. |
| P2 | **G4-05 perdería una respuesta válida al conectar el corrector.** El cálculo y la solución escrita son correctos. La tolerancia de 0,0001 alrededor de 7,9375 excluye el 7,94 que muestra la solución y que pedía la consigna heredada a dos decimales. El borrador también omite la suma y la clasificación de la moda que pedía la actividad anterior. [Ejercicio actual:7](../src/content/ejercicios/g4-05.json#L7) · [Ejercicio anterior:1489](../../web-estadistica/scripts/bank/guia.js#L1489) | Hacer explícito el redondeo esperado, probarlo con coma decimal y decidir si el piloto conserva todas las partes de la actividad. |
| P2 | **El validador tiene cobertura parcial.** Solo revisa campos mínimos e IDs en los JSON de ejercicios del primer nivel. Aceptaría un banco vacío y no comprueba el tipo de `esperado` por clase de respuesta. Astro valida por separado el esquema de las colecciones durante el build. [scripts/validate-content.mjs:10](../scripts/validate-content.mjs#L10) · [src/lib/content/esquemas.ts:19](../src/lib/content/esquemas.ts#L19) | Validar con el mismo esquema en ambos caminos, exigir tipos por respuesta y medir cobertura según la fase. |
| P2 | **Contraste insuficiente en los enlaces.** `#3b82f6` sobre `#f8f9fa` da 3,49:1. Los enlaces de 18 px de peso normal requieren 4,5:1 para AA. [src/styles/global.css:4](../src/styles/global.css#L4) | Alcanzar 4,5:1 en el texto de enlace y verificar los estados de interacción. |

La estructura actual usa `lang="es-AR"`, un `main` por página, encabezados jerárquicos, enlaces nativos y zoom habilitado. El layout todavía no ofrece enlace de salto a contenido. El borrador de M1 distingue dato, variable y frecuencia, pero su cuerpo tiene un solo párrafo. Para cerrar F1 faltan ejemplo resuelto, práctica acompañada e independiente, errores frecuentes y una comprobación final, según [AGENTS.md](../../AGENTS.md#cómo-enseñar-y-escribir-cada-explicación).

El índice de la propuesta mantiene la plataforma como pendiente y F0 mantiene abierto el nombre del repositorio, pese a que [las decisiones registradas](../../DeepSeek_Harness/06_PROPUESTA_NUEVO_PROYECTO/01_RESUMEN_Y_DECISIONES.md#4-decisiones-estado) los dan por cerrados. Para el despliegue prevalece el criterio técnico de una compilación por base. Para probabilidad se mantiene la etiqueta de ampliación curricular del Ciclo Básico. La asignación jurisdiccional exacta a 2.º año sigue pendiente de cotejo.

## C14 · Cotejo de la fuente

Leí la actividad 3 en la [foto original](<../../2026 -  2do IVto - Estadistica/Cileitos_notebooks/WhatsApp Image 2026-11-08 at 11.49.46.jpeg>). En la primera línea se leen tres 4 y seis 7. La segunda línea, «3, 2, 1, 10, 8, 6», no contiene ninguno de los dos valores. El recuento de las 40 observaciones da:

| Nota | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Frecuencia | 1 | 2 | 2 | 3 | 5 | 5 | 6 | 7 | 6 | 3 |

La suma ponderada es **260**, el promedio es **6,5** y la moda es **8**. La lectura respalda la transcripción del consolidado para esta actividad y resuelve la discrepancia 260/263 señalada en [A02](../../DeepSeek_Harness/03_AUDITORIAS/A02_2026-11-09_REVISION_DE_LA_PROPUESTA.md). La revisión del resto del inventario de 84 actividades corresponde a F2.

## Pruebas y límites

- **Entorno local** con Node 26.12.1, npm 11.20.0, Astro 5.18.2, Vitest 2.1.9 y Playwright Test 1.65.0 resueltos en la copia. CI declara Node 20.
- **Vitest** pasó las 39 pruebas de 4 archivos. El caso de simulación comprueba reproducibilidad con la misma semilla. Queda pendiente un resultado de referencia independiente y comprobar que las frecuencias sumen la cantidad de tiradas.
- **Compilación** exitosa con base raíz y con `/Educ_Sec_CBCSO_2_Probabilidad_y_Estadistica/`. Cada build generó dos páginas. La lectura del HTML confirmó los enlaces absolutos.
- **Validación** reportó un ejercicio de M4. `npm ci`, `npm run check` y `npm run test:e2e` reprodujeron los fallos descritos.
- **Navegador**. Chrome agotó el tiempo de conexión al servidor local. El hallazgo de subruta se verificó en los enlaces del HTML compilado. El recorrido con teclado a 320 px queda pendiente.
- **Alcance** local. Quedan pendientes la auditoría WCAG completa, las pruebas de PWA, la revisión integral del banco y la validación en un hosting real. La revisión de interfaz tomó como referencias las [Web Interface Guidelines de Vercel](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) y el [criterio de contraste WCAG 2.2 del W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

## Orden de trabajo para cerrar F1

1. Restablecer CI reproducible, pasar la comprobación de tipos y reparar la navegación en ambas bases.
2. Abrir una lección de punta a punta, cerrar los casos límite del motor que usa el piloto y asegurar que el corrector acepte la respuesta enseñada.
3. Completar M1 y M2 con la cobertura de F1 y ejecutar las dos actividades interactivas con teclado a 320 px. El criterio del gráfico y del árbol incluye construir, obtener un resultado y justificarlo.
