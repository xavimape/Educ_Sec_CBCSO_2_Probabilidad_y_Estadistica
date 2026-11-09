---
id: 'M4-01'
titulo: 'Media, mediana y moda'
modulo: 'M4'
orden: 4
objetivo: 'Calcular la media, la mediana y la moda de una lista o de una tabla, y explicar qué responde cada una.'
saberesPrevios: ['sumar', 'dividir', 'ordenar números']
etiquetas: ['media', 'mediana', 'moda', 'promedio']
---

## Para arrancar

Tres amigos tienen 2, 3 y 4 figuritas. Si las juntaran todas y las repartieran en partes iguales, ¿cuántas le tocaría a cada uno?

## La idea con palabras

Hay tres medidas que resumen «el centro» de un conjunto de datos, y cada una responde una pregunta distinta:

- **Media (promedio)**: «¿cuánto le tocaría a cada uno en un reparto igual?»
- **Mediana**: «¿qué valor queda en el centro cuando ordenamos?»
- **Moda**: «¿qué valor aparece más veces?»

## La media

**Promedio = suma de todos los datos ÷ cantidad de datos.**

Ejemplo con 2, 3 y 4: suma `2 + 3 + 4 = 9`; cantidad de datos 3; promedio `9 ÷ 3 = 3`.

Desde una tabla, multiplicás cada valor por su frecuencia antes de sumar, y dividís por el **total de observaciones** (no por la cantidad de filas). Con los libros (`f = 3, 8, 6, 2, 1`):

`0×3 + 1×8 + 2×6 + 3×2 + 4×1 = 0 + 8 + 12 + 6 + 4 = 30`, y `30 ÷ 20 = 1,5 libros`.

## La mediana

Ordenás de menor a mayor y buscás el centro.

- **Cantidad impar**: el dato del medio. En `0, 1, 1, 2, 6` la mediana es `1` (posición 3).
- **Cantidad par**: promediás los dos centrales. En las estaturas `162, 165, 168, 170, 172, 175, 180, 188`, los centrales son 170 y 172: `(170 + 172) ÷ 2 = 171 cm`.

**Ojo:** la mediana es un **valor**, no una posición. En ese ejemplo, la posición central es la 4,5, pero la mediana es 171 cm.

## La moda

Es el **valor** más frecuente, no la frecuencia máxima. En `5, 6, 6, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 10, 10, 10`, el 8 aparece 4 veces: la moda es **8** (y su frecuencia es 4).

- Si empatan dos valores, hay dos modas: en `1, 1, 2, 2, 3` las modas son `1` y `2`.
- Si todos los valores tienen la misma frecuencia, la serie es **amodal** (no hay moda destacada).

## La notación

| Símbolo | Cómo se lee | Qué significa |
| --- | --- | --- |
| `x̄` | equis barra | media (promedio) |
| `Me` | eme e | mediana |
| `Mo` | eme o | moda |
| `Σ` | sumatoria | «sumar los términos indicados» |

## Errores frecuentes

1. **Dividir por la cantidad de filas** en una tabla, en vez de por el total de observaciones.
2. **Promediar nombres** en la mediana de categorías: si las dos centrales son «regular» y «bueno», no se hace `(regular + bueno) ÷ 2`; se aclara el criterio.
3. **Decir que la moda es la frecuencia** («la moda es 4») cuando es el valor («la moda es 8»).

## Practicá

**Acompañada.** Calculá media, mediana y moda de `3, 1, 2, 3, 1`.

**Sin ayuda.** Dieciséis alumnos sacaron estos aciertos: `5, 6, 6, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 10, 10, 10`. Hallá la suma, la media (redondeada a 2 decimales), la mediana y la moda.

---

<details>
<summary>Respuestas</summary>

**Acompañada.** Ordenado: `1, 1, 2, 3, 3`. Media `10 ÷ 5 = 2`; mediana `2`; modas `1` y `3`.

**Sin ayuda.** Suma 127; media `127 ÷ 16 = 7,9375 ≈ 7,94`; mediana 8 (los centrales son 8 y 8); moda 8.
</details>

## Para cerrar

¿Puede una media dar un valor que no esté en la lista original? Justificá con el ejemplo de los libros (media 1,5) y explicá por qué 1,5 libros no significa que alguien leyó «un libro y medio» de verdad.
