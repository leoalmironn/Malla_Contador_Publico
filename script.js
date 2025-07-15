const materias = {
  "1": [
    { codigo: "101", nombre: "Álgebra y Geometría Analítica", requisitos: [], cuatrimestre: 1 },
    { codigo: "102", nombre: "Fundamentos de Administración", requisitos: [], cuatrimestre: 1 },
    { codigo: "103", nombre: "Fundamentos de Contabilidad", requisitos: [], cuatrimestre: 1 },
    { codigo: "104", nombre: "Fundamentos de Economía", requisitos: [], cuatrimestre: 1 },
    { codigo: "105", nombre: "Cálculo Diferencial e Integral", requisitos: ["101"], cuatrimestre: 2 },
    { codigo: "106", nombre: "Fundamentos de Derecho Civil y Comercial", requisitos: [], cuatrimestre: 2 },
    { codigo: "107", nombre: "Metodología de las Cs. Sociales", requisitos: [], cuatrimestre: 2 }
  ],
  "2": [
    { codigo: "201", nombre: "Derecho de Contratos y Títulos Valores", requisitos: ["106"], cuatrimestre: 1 },
    { codigo: "202", nombre: "Introducción a la Estadística", requisitos: ["105"], cuatrimestre: 1 },
    { codigo: "203", nombre: "Microeconomía Básica", requisitos: ["104", "105"], cuatrimestre: 1 },
    { codigo: "204", nombre: "Sistemas Contables", requisitos: ["103"], cuatrimestre: 2 },
    { codigo: "205", nombre: "Informática Aplicada", requisitos: [], cuatrimestre: 2 },
    { codigo: "206", nombre: "Derecho Público", requisitos: ["106"], cuatrimestre: 2 },
    { codigo: "207", nombre: "Macroeconomía Básica", requisitos: ["203"], cuatrimestre: 2 }
  ],
  "3": [
    { codigo: "301", nombre: "Derecho Societario y Concursal", requisitos: ["201"], cuatrimestre: 1 },
    { codigo: "302", nombre: "Medición Contable", requisitos: ["204"], cuatrimestre: 1 },
    { codigo: "303", nombre: "Sistemas Administrativos", requisitos: ["204", "201"], cuatrimestre: 1 },
    { codigo: "304", nombre: "Finanzas Públicas", requisitos: ["207", "206"], cuatrimestre: 2 },
    { codigo: "305", nombre: "Historia Económica", requisitos: ["207"], cuatrimestre: 2 },
    { codigo: "306", nombre: "Matemática Financiera", requisitos: ["202"], cuatrimestre: 2 }
  ],
  "4": [
    { codigo: "401", nombre: "Administración Financiera", requisitos: ["306"], cuatrimestre: 1 },
    { codigo: "402", nombre: "Derecho del Trabajo", requisitos: [], cuatrimestre: 1 },
    { codigo: "403", nombre: "Exposición y Análisis de la Información Contable", requisitos: ["302"], cuatrimestre: 1 },
    { codigo: "404", nombre: "Asignatura Optativa a Elección", requisitos: [], cuatrimestre: 2 },
    { codigo: "405", nombre: "Seminario a Elección", requisitos: [], cuatrimestre: 2 },
    { codigo: "406", nombre: "Teoría y Contabilidad de Costos", requisitos: ["302"], cuatrimestre: 2 },
    { codigo: "407", nombre: "Tributos Indirectos y Derecho Tributario", requisitos: ["304"], cuatrimestre: 2 }
  ],
  "5": [
    { codigo: "501", nombre: "Contabilidad Pública", requisitos: [], cuatrimestre: 1 },
    { codigo: "502", nombre: "Impuestos Directos y Procedimientos Tributarios", requisitos: ["402", "301", "403", "407"], cuatrimestre: 1 },
    { codigo: "503", nombre: "Práctica Profesional Supervisada: Laboral, Jurídica y Societaria", requisitos: ["402", "403"], cuatrimestre: 1 },
    { codigo: "504", nombre: "Auditoría", requisitos: ["402", "403", "406"], cuatrimestre: 2 },
    { codigo: "505", nombre: "Gestión de Empresas", requisitos: ["407", "403"], cuatrimestre: 2 },
    { codigo: "506", nombre: "Práctica Profesional Supervisada: Contable e Impositiva y Laboral", requisitos: ["402", "407"], cuatrimestre: 2 },
    { codigo: "507", nombre: "Seminario de Contabilidad Social y Ambiental", requisitos: ["403"], cuatrimestre: 2 }
  ]
};

let aprobadas = new Set();
const guardadas = JSON.parse(localStorage.getItem("aprobadas")) || [];
aprobadas = new Set(guardadas);

function puedeCursar(materia) {
  return !materia.requisitos.length || materia.requisitos.every(r => aprobadas.has(r));
}

function calcularPorcentaje() {
  let totalMaterias = 0;
  for (const anio in materias) {
    totalMaterias += materias[anio].length;
  }
  const aprobadasCount = aprobadas.size;
  const porcentaje = Math.round((aprobadasCount / totalMaterias) * 100);
  document.getElementById("porcentajeAvance").innerText = `Avance: ${porcentaje}%`;
}

function renderMalla() {
  const malla = document.getElementById("malla");
  malla.innerHTML = "";

  for (const anio in materias) {
    const contenedor = document.createElement("div");
    contenedor.className = "anio";
    contenedor.innerHTML = `
      <h2>${anio}° Año</h2>
      <h3>1° Cuatrimestre</h3>
      <div class="cuatri" id="cuatri-1-${anio}"></div>
      <h3>2° Cuatrimestre</h3>
      <div class="cuatri" id="cuatri-2-${anio}"></div>
    `;

    malla.appendChild(contenedor);

    materias[anio].forEach(materia => {
      const div = document.createElement("div");
      div.className = "materia";
      div.innerText = `${materia.codigo} - ${materia.nombre}`;

      const puedeRendir = puedeCursar(materia);

      if (aprobadas.has(materia.codigo)) {
        div.classList.add("aprobada");
      } else if (puedeRendir) {
        div.classList.add("habilitada");
      } else {
        div.classList.add("bloqueada");
      }

      div.onclick = () => {
        if (aprobadas.has(materia.codigo)) {
          aprobadas.delete(materia.codigo);
        } else if (puedeRendir) {
          aprobadas.add(materia.codigo);
        }
        localStorage.setItem("aprobadas", JSON.stringify([...aprobadas]));
        renderMalla();
      };

      const destino = document.getElementById(`cuatri-${materia.cuatrimestre}-${anio}`);
      destino.appendChild(div);
    });
  }

  calcularPorcentaje();
}

// Evento reiniciar
document.getElementById("reiniciarBtn").addEventListener("click", () => {
  if (confirm("¿Estás seguro que querés reiniciar la malla? Se perderán las materias aprobadas.")) {
    aprobadas.clear();
    localStorage.removeItem("aprobadas");
    renderMalla();
  }
});

document.addEventListener("DOMContentLoaded", renderMalla);
