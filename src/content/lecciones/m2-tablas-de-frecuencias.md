---
id: 'M2-01'
titulo: 'Tablas de frecuencias'
modulo: 'M2'
orden: 2
objetivo: 'Construir una tabla de frecuencias (absoluta, relativa, porcentual y acumulada) y leerla para responder preguntas.'
saberesPrevios: ['contar', 'dividir', 'calcular porcentajes']
etiquetas: ['frecuencia', 'tabla', 'porcentaje', 'acumulada']
---

## Para arrancar

Si en un curso de 20 estudiantes, 8 leyeron exactamente 1 libro, ¿qué parte del total representa? Escribilo como fracción, como decimal y como porcentaje.

## La idea con palabras

Cuando tenés muchos datos repetidos, conviene **ordenarlos en una tabla** en vez de repetir la lista. La tabla responde cuatro preguntas distintas:

- **Frecuencia absoluta (`f`)**: cuántas veces aparece cada valor.
- **Frecuencia relativa (`fr`)**: qué parte del total representa. Se calcula `f ÷ total`.
- **Frecuencia porcentual (`%`)**: la parte expresada cada 100. Se calcula `fr × 100`.
- **Frecuencia acumulada (`F`)**: cuántas observaciones hay «hasta acá», sumando las frecuencias de arriba hacia abajo.

## Un ejemplo con números

Veinte estudiantes anotaron cuántos libros leyeron en el verano:

| Libros | 0 | 1 | 2 | 3 | 4 |
| --- | ---: | ---: | ---: | ---: | ---: |
| **f** | 3 | 8 | 6 | 2 | 1 |

La tabla completa queda así:

| Libros | f | fr | % | F |
| --- | ---: | ---: | ---: | ---: |
| 0 | 3 | 0,15 | 15 % | 3 |
| 1 | 8 | 0,40 | 40 % | 11 |
| 2 | 6 | 0,30 | 30 % | 17 |
| 3 | 2 | 0,10 | 10 % | 19 |
| 4 | 1 | 0,05 | 5 % | 20 |
| **Total** | **20** | **1,00** | **100 %** | — |

**Cómo se llena cada columna** (fila de «1 libro», con `f = 8`):

- `fr = 8 ÷ 20 = 0,40`.
- `% = 0,40 × 100 = 40 %`.
- `F = 3 + 8 = 11` (lo acumulado hasta acá).

## La notación

| Símbolo | Cómo se lee | Qué significa |
| --- | --- | --- |
| `f` | efe | frecuencia absoluta |
| `fr` | efe erre | frecuencia relativa |
| `%` | por ciento | frecuencia porcentual |
| `F` | efe mayúscula | frecuencia acumulada |
| `n` | ene | total de observaciones |

## Errores frecuentes

1. **Confundir 0,15 con 0,15 %.** `0,15` es el decimal; el porcentaje es `15 %`. Son dos formas de lo mismo, no lo mismo escrito dos veces.
2. **Dividir mal.** La relativa se divide por el **total de observaciones** (20), no por la cantidad de filas (5).
3. **Acumular sin orden.** «Hasta 2 libros» solo tiene sentido porque 0, 1, 2, 3, 4 van en orden. En categorías sin orden (como colores), la acumulada no se interpreta igual.

## Practicá

**Acompañada.** En una salida educativa, un curso de 40 alumnos eligió: reserva 25, teatro 9, museo 6. ¿Cuál es el porcentaje del museo?

**Sin ayuda.** Las faltas de 15 alumnos fueron `0, 1, 2, 0, 1, 1, 3, 0, 2, 1, 0, 1, 2, 1, 0`. Construí la tabla con `f` y `F`.

---

<details>
<summary>Respuestas</summary>

**Acompañada.** Museo: `6 ÷ 40 = 0,15 = 15 %`. (Reserva 62,5 % y teatro 22,5 %.)

**Sin ayuda.** Frecuencias: 0 → 5, 1 → 6, 2 → 3, 3 → 1. Acumuladas: 5, 11, 14, 15. Comprobá que `5 + 6 + 3 + 1 = 15`.
</details>

## Para cerrar

¿Por qué la columna de porcentajes tiene que sumar 100 % **antes de redondear**? Si redondeás cada fila por separado y la suma te da 99 % o 101 %, explicá qué pasó.
