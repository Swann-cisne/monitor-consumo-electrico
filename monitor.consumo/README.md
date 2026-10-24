# Monitor de Consumo Eléctrico

Este proyecto es una solución en JavaScript (Node.js) para resolver un problema de análisis de datos de un centro de monitoreo. La idea principal es encontrar en qué ventana de tiempo de $k$ horas consecutivas un edificio tuvo el mayor consumo promedio de energía.

Para resolverlo, implementé dos formas de calcularlo: una estrategia directa (fuerza bruta) y una optimización usando la técnica de **ventana deslizante**.

---

## 1. Explicación del Problema y Contrato

En palabras sencillas, nos entregan una lista de mediciones con la hora y el consumo en kWh, junto con un número $k$ que representa cuántas horas juntas queremos evaluar.

### Lo que espera el programa (Entradas)
* **Arreglo de lecturas**: Una lista con objetos que tienen `hora` (texto) y `kwh` (número positivo o cero).
* **Tamaño de ventana (k)**: Un número entero que debe ser como mínimo 1 y como máximo la cantidad total de lecturas.

### Manejo de datos inválidos
Si la entrada viene mal (por ejemplo, si nos pasan un arreglo vacío, datos incompletos, números negativos o un valor de $k$ fuera de rango), la función de validación detecta el problema de inmediato y regresa un mensaje claro especificando qué falló. No se inventan ventanas ficticias ni se procesan datos corruptos.

### Lo que devuelve el programa (Salida)
Devuelve la posición inicial y final de la mejor ventana, el promedio de kWh calculado, la cantidad de operaciones que le tomó a cada algoritmo llegar a ese resultado y una confirmación de que ambas estrategias dieron exactamente el mismo resultado.

---

## 2. Ejemplo Manual y Simulación

Para entender cómo funciona antes de programar, hice una prueba a mano con un ejemplo pequeño de 5 lecturas y un tamaño de ventana $k = 3$:

* Lectura 0: 08:00 -> 10.0 kWh
* Lectura 1: 09:00 -> 20.0 kWh
* Lectura 2: 10:00 -> 30.0 kWh
* Lectura 3: 11:00 -> 15.0 kWh
* Lectura 4: 12:00 -> 5.0 kWh

### Probando las ventanas posibles
* **Ventana 0** (de 08:00 a 10:00): Sumamos 10 + 20 + 30 = 60. Promedio = 20.0 kWh.
* **Ventana 1** (de 09:00 a 11:00): Sumamos 20 + 30 + 15 = 65. Promedio = **21.67 kWh**. *(Esta es la mayor)*
* **Ventana 2** (de 10:00 a 12:00): Sumamos 30 + 15 + 5 = 50. Promedio = 16.67 kWh.

### ¿Cómo lo hace la Ventana Deslizante?
1. En la primera ventana (índices 0 a 2), calcula la suma inicial: $10 + 20 + 30 = 60$.
2. Para pasar a la siguiente ventana (índices 1 a 3), no vuelve a sumar todo desde cero. Simplemente resta el valor que se quedó atrás (10) y le suma el nuevo valor que entra (15): $60 - 10 + 15 = 65$. Como 65/3 es mayor que 20.0, guarda esta como la nueva mejor ventana.
3. Para la última ventana (índices 2 a 4), hace lo mismo: resta 20 y suma 5 $\rightarrow 65 - 20 + 5 = 50$. Como 50/3 es menor, mantiene la Ventana 1.

Con esto se demuestra que se logra exactamente el mismo resultado realizando menos operaciones.

---

## 3. Requisitos y Ejecución

* **Requisitos**: Tener instalado Node.js en la máquina (no requiere instalar librerías externas ni utilizar `npm install`).
* **Comando para correr el proyecto**:
```bash
node src/index.js