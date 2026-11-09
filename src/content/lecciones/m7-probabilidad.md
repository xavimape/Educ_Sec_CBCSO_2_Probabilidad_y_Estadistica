---
id: 'M7-01'
titulo: 'Conteo y probabilidad'
modulo: 'M7'
orden: 7
objetivo: 'Contar resultados con diagramas de árbol y calcular probabilidades clásicas con casos favorables y posibles.'
saberesPrevios: ['espacio muestral', 'fracciones', 'multiplicar']
etiquetas: ['probabilidad', 'diagrama de árbol', 'conteo', 'complemento']
---

## Para arrancar

Si tirás una moneda dos veces, ¿cuántos resultados distintos pueden salir? Escribilos todos.

## La idea con palabras

Para no olvidar resultados, usamos un **diagrama de árbol**: en cada etapa abrís todas las opciones, y cada camino del árbol es un resultado.

Para calcular una probabilidad con resultados **equiprobables** (todos con la misma chance):

**probabilidad = casos favorables ÷ casos posibles**.

## El diagrama de árbol

Moneda dos veces:

```text
             ┌─ cara ── CC
  1.º: cara ─┤
             └─ ceca ── CS

             ┌─ cara ── SC
  1.º: ceca ─┤
             └─ ceca ── SS
```

Hay **4** caminos: `CC, CS, SC, SS`. El árbol los muestra todos sin repetir ni saltear.

## El principio de conteo

Si la primera etapa tiene 2 opciones y la segunda otras 2, el total es `2 × 2 = 4`. En general se **multiplica** la cantidad de opciones de cada etapa. Por ejemplo, con 3 remeras y 2 pantalones: `3 × 2 = 6` conjuntos posibles.

## La probabilidad clásica

«Al menos una cara» en dos monedas: favorables `CC, CS, SC` (3), posibles 4.

`P = 3 ÷ 4 = 0,75` (o 75 %).

**Importante:** la regla `favorables ÷ posibles` vale cuando los resultados elementales son **equiprobables**. Si el dado está cargado, la regla no aplica sin más.

## El suceso complementario

`P(que no ocurra A) = 1 − P(A)`.

La probabilidad de **no** sacar un 6 en un dado: `1 − 1/6 = 5/6`.

## Errores frecuentes

1. **Aplicar `favorables ÷ posibles` sin equiprobabilidad.** Primero verificá que todos los resultados tengan la misma chance.
2. **Contar mal** los resultados de dos etapas: el árbol evita sumar donde hay que multiplicar.
3. **Confundir probabilidad con porcentaje** sin aclarar la unidad: `0,75` es `75 %`, no `0,75 %`.

## Practicá

**Acompañada.** ¿Cuál es la probabilidad de sacar un número par en un dado?

**Sin ayuda.** Se elige al azar una remera (roja, azul, verde) y un pantalón (negro, blanco). ¿Cuántos conjuntos posibles hay? ¿Cuál es la probabilidad de elegir remera roja y pantalón negro?

---

<details>
<summary>Respuestas</summary>

**Acompañada.** Pares: `{2, 4, 6}` → `3 ÷ 6 = 1/2 = 0,5`.

**Sin ayuda.** Conjuntos: `3 × 2 = 6`. Probabilidad de «roja y negro»: 1 de 6 → `1/6 ≈ 0,167`.
</details>

## Para cerrar

Con dos monedas, ¿cuál es la probabilidad de que salgan **dos caras**? ¿Y de que **no** salgan dos caras? Resolvé la segunda usando el complemento.
