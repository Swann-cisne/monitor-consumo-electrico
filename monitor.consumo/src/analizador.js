

/*Valida que el arreglo de lecturas y el tamaño de ventana k cumplan con el contrato.
 * Detecta arreglo vacío, k fuera de rango, campos faltantes o valores no numéricos/negativos.
 */
function validarEntradas(lecturas, k) {
  if (!Array.isArray(lecturas) || lecturas.length === 0) {
    return {
      esValido: false,
      mensaje: "El arreglo de lecturas está vacío o no es una lista válida."
    };
  }

  if (typeof k !== "number" || !Number.isInteger(k) || k < 1 || k > lecturas.length) {
    return {
      esValido: false,
      mensaje: `El tamaño de ventana k (${k}) es inválido. Debe ser un entero entre 1 y ${lecturas.length}.`
    };
  }

  for (let i = 0; i < lecturas.length; i++) {
    const item = lecturas[i];
    if (!item || typeof item !== "object" || !("hora" in item) || !("kwh" in item)) {
      return {
        esValido: false,
        mensaje: `La lectura en el índice ${i} está incompleta o carece de las propiedades 'hora' y 'kwh'.`
      };
    }

    if (typeof item.kwh !== "number" || isNaN(item.kwh) || item.kwh < 0) {
      return {
        esValido: false,
        mensaje: `La lectura en el índice ${i} contiene un valor 'kwh' no numérico o negativo: ${item.kwh}.`
      };
    }
  }

  return { esValido: true, mensaje: "Entradas válidas." };
}

/*Estrategia Directa: Recorre cada ventana consecutiva recalculando la suma desde cero.
 */
function estrategiaDirecta(lecturas, k) {
  const n = lecturas.length;
  let maxPromedio = -Infinity;
  let posicionInicial = -1;
  let posicionFinal = -1;
  let operacionesSuma = 0;

  for (let i = 0; i <= n - k; i++) {
    let sumaVentana = 0;
    for (let j = 0; j < k; j++) {
      sumaVentana += lecturas[i + j].kwh;
      operacionesSuma++;
    }

    const promedio = sumaVentana / k;
    if (promedio > maxPromedio) {
      maxPromedio = promedio;
      posicionInicial = i;
      posicionFinal = i + k - 1;
    }
  }

  return {
    posicionInicial,
    posicionFinal,
    promedio: maxPromedio,
    operaciones: operacionesSuma
  };
}

/*Estrategia Ventana Deslizante: Reutiliza la suma restando la lectura saliente y sumando la entrante.
 */
function estrategiaVentanaDeslizante(lecturas, k) {
  const n = lecturas.length;
  let operacionesSuma = 0;

  // Suma inicial de la primera ventana
  let sumaActual = 0;
  for (let i = 0; i < k; i++) {
    sumaActual += lecturas[i].kwh;
    operacionesSuma++;
  }

  let maxPromedio = sumaActual / k;
  let posicionInicial = 0;
  let posicionFinal = k - 1;

  // Deslizamiento de ventana
  for (let i = 1; i <= n - k; i++) {
    sumaActual = sumaActual - lecturas[i - 1].kwh + lecturas[i + k - 1].kwh;
    operacionesSuma += 2; 

    const promedioActual = sumaActual / k;
    const EPSILON = 1e-9; 

    if (promedioActual - maxPromedio > EPSILON) {
      maxPromedio = promedioActual;
      posicionInicial = i;
      posicionFinal = i + k - 1;
    }
  }

  return {
    posicionInicial,
    posicionFinal,
    promedio: maxPromedio,
    operaciones: operacionesSuma
  };
}

/* Operación pública de integración: Valida las entradas y compara ambas estrategias.*/
function analizarConsumo(lecturas, k) {
  const validacion = validarEntradas(lecturas, k);

  if (!validacion.esValido) {
    return {
      esValido: false,
      mensajeError: validacion.mensaje,
      resultadoDirecto: null,
      resultadoDeslizante: null,
      coinciden: false
    };
  }

  const resDirecto = estrategiaDirecta(lecturas, k);
  const resDeslizante = estrategiaVentanaDeslizante(lecturas, k);

  const EPSILON = 1e-9;
  const coincidenVentana = resDirecto.posicionInicial === resDeslizante.posicionInicial &&
                           resDirecto.posicionFinal === resDeslizante.posicionFinal;
  const coincidenPromedio = Math.abs(resDirecto.promedio - resDeslizante.promedio) < EPSILON;
  const coinciden = coincidenVentana && coincidenPromedio;

  return {
    esValido: true,
    mensajeError: null,
    resultadoDirecto: resDirecto,
    resultadoDeslizante: resDeslizante,
    coinciden
  };
}

module.exports = {
  validarEntradas,
  estrategiaDirecta,
  estrategiaVentanaDeslizante,
  analizarConsumo
};