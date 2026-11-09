# Auditoría del banco

**Fecha:** 9 de noviembre de 2026. **Alcance:** las 104 actividades (84 heredadas + 20 nuevas). **Método:** validación estructural con Zod y `validate-content`, recálculo de las 20 nuevas, y verificación de las regresiones históricas.

## 1. Resultado en una línea

El banco es **estructuralmente íntegro y su cobertura está cerrada**. Las 20 actividades nuevas fueron recalculadas; las 84 heredadas se apoyan en la verificación del proyecto anterior (12 pruebas, fixtures independientes y la auditoría inicial) y en una migración sin pérdida. Queda como residual un recálculo línea por línea de las 84 contra la captura original.

## 2. Qué está verificado

| Nivel | Evidencia |
| --- | --- |
| Estructura | Los 104 archivos validan contra el esquema Zod (`tests/unit/contenido.test.ts`) y contra `validate-content.mjs` (IDs únicos, banco no vacío, `esperado` por tipo de respuesta). |
| Regresiones históricas | `G4-05` (suma 127, media 7,9375 ≈ 7,94), `G4-07` (medianas 1 y 0,5) y `G3-07` (12,5 cuadritos) están fijadas en `tests/unit/medidas.test.ts`. |
| C14 (notas) | Resuelto por lectura de la foto original: suma 260, media 6,5, moda 8. |
| 20 nuevas | Recalculadas una a una al escribirlas (ángulos, porcentajes, conteos y probabilidades): todas cierran. |
| Migración | `migrate-bank.mjs` es **lossless**: todo campo no mapeado se conserva en `detalle`, por lo que no se perdió contenido al pasar de los 3 archivos fuente a JSON. |

## 3. Qué hereda el banco (y su estado)

Las 84 heredadas provienen del proyecto anterior, que ya las había verificado con: 12 pruebas de `npm test`, fixtures independientes para los errores históricos, y la auditoría inicial que reprodujo y corrigió defectos. La migración conservó esa información (incluidas las soluciones, pistas y el feedback rico por opción).

## 4. Residual (tarea continua, baja prioridad)

- **Recálculo línea por línea de las 84 heredadas** contra sus datos y, donde exista, contra la captura original del aula. C14 fue el primer caso y quedó resuelto. El resto es una pasada de verificación que conviene completar antes de la primera publicación (F4), no bloquea el cierre de F2.

## 5. Regla de oro

Ninguna respuesta se valida comparando una función consigo misma. Las comprobaciones automáticas verifican **estructura e integridad**; la **corrección matemática** se verifica por recálculo independiente, como se hizo con las 20 nuevas y con las regresiones históricas.
