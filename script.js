const materias = {
  "1": [
    { codigo: "101", nombre: "Algoritmos y Estructuras de Datos I", requisitos: [], cuatrimestre: 1 },
    { codigo: "102", nombre: "Álgebra", requisitos: [], cuatrimestre: 1 },
    { codigo: "103", nombre: "Algoritmos y Estructuras de Datos II", requisitos: ["101"], cuatrimestre: 2 },
    { codigo: "104", nombre: "Lógica y Matemática Computacional", requisitos: ["102"], cuatrimestre: 2 },
    { codigo: "105", nombre: "Sistemas y Organizaciones", requisitos: [], cuatrimestre: 2 }
  ],
  "2": [
    { codigo: "201", nombre: "Paradigmas y Lenguajes", requisitos: ["103"], cuatrimestre: 1 },
    { codigo: "202", nombre: "Arquitectura y Organización de Computadoras", requisitos: ["104"], cuatrimestre: 1 },
    { codigo: "203", nombre: "Cálculo Diferencial e Integral", requisitos: ["102", "104"], cuatrimestre: 1 },
    { codigo: "204", nombre: "Programación Orientada a Objetos", requisitos: ["103", "201"], cuatrimestre: 2 },
    { codigo: "205", nombre: "Sistemas Operativos", requisitos: ["103", "202"], cuatrimestre: 2 },
    { codigo: "206", nombre: "Administración y Gestión de Organizaciones", requisitos: ["105"], cuatrimestre: 2 }
  ],
  "3": [
    { codigo: "301", nombre: "Taller de Programación I", requisitos: ["204"], cuatrimestre: 1 },
    { codigo: "302", nombre: "Comunicaciones de Datos", requisitos: ["205"], cuatrimestre: 1 },
    { codigo: "303", nombre: "Ingeniería de Software I", requisitos: ["204", "206"], cuatrimestre: 1 },
    { codigo: "304", nombre: "Taller de Programación II", requisitos: ["301", "303"], cuatrimestre: 2 },
    { codigo: "305", nombre: "Probabilidad y Estadística", requisitos: ["203"], cuatrimestre: 2 },
    { codigo: "306", nombre: "Bases de Datos I", requisitos: ["303"], cuatrimestre: 2 },
    { codigo: "307", nombre: "Inglés Técnico Informático", requisitos: [], cuatrimestre: 1 }
  ],
  "4": [
    { codigo: "401", nombre: "Ingeniería de Software II", requisitos: ["303"], cuatrimestre: 1 },
    { codigo: "402", nombre: "Economía Aplicada", requisitos: ["303"], cuatrimestre: 1 },
    { codigo: "403", nombre: "Teoría de la Computación", requisitos: ["202", "305"], cuatrimestre: 1 },
    { codigo: "404", nombre: "Redes de Datos", requisitos: ["302"], cuatrimestre: 2 },
    { codigo: "405", nombre: "Bases de Datos II", requisitos: ["306"], cuatrimestre: 2 },
    { codigo: "406", nombre: "Métodos Computacionales", requisitos: ["305"], cuatrimestre: 2 }
  ],
  "5": [
    { codigo: "501", nombre: "Proyecto Final de Carrera", requisitos: ["304", "305", "307", "401", "402", "403", "404", "405", "406", "502"], cuatrimestre: 1 },
    { codigo: "502", nombre: "Auditoría y Seguridad Informática", requisitos: ["404", "405"], cuatrimestre: 1 },
    { codigo: "503", nombre: "Optativa I", requisitos: ["403"], cuatrimestre: 1 },
    { codigo: "504", nombre: "Optativa II", requisitos: ["404"], cuatrimestre: 2 },
    { codigo: "505", nombre: "Optativa III", requisitos: ["405"], cuatrimestre: 2 }
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
