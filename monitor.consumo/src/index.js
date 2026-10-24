
const lecturasBase = require("./datos.js");
const { analizarConsumo } = require("./analizador.js");

function probarCaso(titulo, lecturas, k) {
  console.log(`\nCaso: ${titulo} (k = ${k})`);

  const res = analizarConsumo(lecturas, k);

  if (!res.ok) {
    console.log(`   Error de validacion: ${res.error}`);
    return;
  }

  const d = res.directo;
  const v = res.deslizante;

  console.log(`   Entrada valida`);
  console.log(`   Directa:    Ventana [${d.posInicio}..${d.posFin}] (${lecturas[d.posInicio].hora} -> ${lecturas[d.posFin].hora}) | ${d.promedio.toFixed(2)} kWh | Sumas: ${d.ops}`);
  console.log(`   Deslizante: Ventana [${v.posInicio}..${v.posFin}] (${lecturas[v.posInicio].hora} -> ${lecturas[v.posFin].hora}) | ${v.promedio.toFixed(2)} kWh | Ops: ${v.ops}`);
  console.log(`   Resultados identicos: ${res.coinciden ? "Si" : "No"}`);
}

console.log("Reporte de Evaluacion - Monitoreo de Consumo Electrico");

/*1. Caso Principal (datos.js, k = 3)*/
probarCaso("Caso Principal", lecturasBase, 3);

/*2. Variacion 1: k = 1*/
probarCaso("Variacion 1: Ventana unitaria", lecturasBase, 1);

/*3. Variacion 2: k = n*/
probarCaso("Variacion 2: Ventana completa", lecturasBase, lecturasBase.length);

/*4. Variacion 3: Valores iguales*/
const datosIguales = [
  { hora: "08:00", kwh: 15 },
  { hora: "09:00", kwh: 15 },
  { hora: "10:00", kwh: 15 },
  { hora: "11:00", kwh: 15 },
  { hora: "12:00", kwh: 15 }
];
probarCaso("Variacion 3: Lecturas con valores iguales", datosIguales, 3);

/*5. Variacion 4: Entrada invalida*/
const datosConError = [
  { hora: "08:00", kwh: 10 },
  { hora: "09:00", kwh: -5 },
  { hora: "10:00", kwh: 12 }
];
probarCaso("Variacion 4: Entrada con kWh negativo", datosConError, 2);