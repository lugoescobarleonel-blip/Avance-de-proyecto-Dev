// app.js (POO + ES6+)

/* =================== MODELO (POO + ES6+) =================== */
class Entrega {
  constructor({ fileName, submittedAt = new Date().toISOString() } = {}) {
    this.fileName = fileName;
    this.submittedAt = submittedAt;
  }
}

class Calificacion {
  constructor({ score, feedback = "", gradedAt = new Date().toISOString() } = {}) {
    this.score = Number(score);
    this.feedback = feedback;
    this.gradedAt = gradedAt;
  }
}

class Tarea {
  constructor({
    id,
    alumnoId,
    nombre,
    descripcion = "",
    materia,
    tipo,
    fechaInicio,
    fechaFin,
    prioridad,
    estado = "pendiente", // pendiente | entregada | revisada
    entrega = null,
    calificacion = null,
  }) {
    if (!nombre) throw new Error("Nombre obligatorio");
    if (!alumnoId) throw new Error("Debes asignar un alumno");
    if (fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
      throw new Error("Fechas inválidas");
    }

    this.id = id ?? Date.now();
    this.alumnoId = alumnoId;
    this.nombre = nombre.trim();
    this.descripcion = (descripcion ?? "").trim();
    this.materia = materia;
    this.tipo = tipo;
    this.fechaInicio = fechaInicio || "";
    this.fechaFin = fechaFin || "";
    this.prioridad = prioridad;
    this.estado = estado;

    this.entrega = entrega ? new Entrega(entrega) : null;
    this.calificacion = calificacion ? new Calificacion(calificacion) : null;
  }

  marcarEntregada(fileName) {
    this.entrega = new Entrega({ fileName });
    this.estado = "entregada";
  }

  calificar(score, feedback) {
    this.calificacion = new Calificacion({ score, feedback });
    this.estado = "revisada";
  }
}

class GestorTareas {
  constructor(storageKey = "tareas_poo_es6") {
    this.storageKey = storageKey;
    this.tareas = [];
  }

  async cargar() {
    const data = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    this.tareas = data.map((t) => new Tarea(t));
  }

  async guardar() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tareas));
  }

  async agregar(tarea) {
    this.tareas.push(tarea);
    await this.guardar();
  }

  // ✅ NUEVO: agregar varias tareas de golpe (para "Todos los alumnos")
  async agregarMuchas(tareas) {
    this.tareas.push(...tareas);
    await this.guardar();
  }

  async eliminar(id) {
    this.tareas = this.tareas.filter((t) => t.id !== id);
    await this.guardar();
  }

  async editar(updated) {
    this.tareas = this.tareas.map((t) => (t.id === updated.id ? new Tarea(updated) : t));
    await this.guardar();
  }

  async entregar(id, fileName) {
    const t = this.tareas.find((x) => x.id === id);
    if (!t) return;
    t.marcarEntregada(fileName);
    await this.guardar();
  }

  async calificar(id, score, feedback) {
    const t = this.tareas.find((x) => x.id === id);
    if (!t) return;
    t.calificar(score, feedback);
    await this.guardar();
  }

  filtrar({ estado = "todas", texto = "", alumnoId = "" } = {}) {
    const q = (texto || "").toLowerCase().trim();
    return this.tareas
      .filter((t) => estado === "todas" || t.estado === estado)
      .filter((t) => !alumnoId || t.alumnoId === alumnoId)
      .filter((t) => !q || `${t.nombre} ${t.descripcion}`.toLowerCase().includes(q));
  }
}

/* =================== DATOS (Alumnos) =================== */
const alumnos = [
  { id: "a1", nombre: "Luis Hernández" },
  { id: "a2", nombre: "María Torres" },
  { id: "a3", nombre: "Carlos Ramírez" },
];

/* =================== UI STATE =================== */
const gestor = new GestorTareas();
let rol = "profesor";
let filtroEstado = "todas";
let editandoId = null;
let alumnoSesionId = alumnos[0].id;

/* =================== DOM =================== */
const sidebar = document.getElementById("sidebar");
const lista = document.getElementById("lista");
const buscar = document.getElementById("buscar");
const filtroAlumno = document.getElementById("filtroAlumno");

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalCancel = document.getElementById("modalCancel");
const modalOk = document.getElementById("modalOk");

/* =================== Helpers =================== */
const alumnoNombre = (id) => alumnos.find((a) => a.id === id)?.nombre || "—";
const escapeHTML = (s = "") =>
  String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m]));

const openModal = ({ title, bodyHTML, okText = "Guardar", cancelText = "Cancelar", onOk }) => {
  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHTML;
  modalOk.textContent = okText;
  modalCancel.textContent = cancelText;

  modalOverlay.style.display = "flex";
  modalOverlay.setAttribute("aria-hidden", "false");

  const clean = () => {
    modalOverlay.style.display = "none";
    modalOverlay.setAttribute("aria-hidden", "true");
    modalOk.onclick = null;
  };

  modalCancel.onclick = clean;
  modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) clean();
  };

  modalOk.onclick = async () => {
    await onOk?.(clean);
  };
};

/* =================== Render Sidebar =================== */
const renderSidebar = () => {
  if (rol === "profesor") {
    sidebar.innerHTML = `
      <h3 style="margin:0 0 8px;">👩‍🏫 Panel Profesor</h3>
      <p class="small" style="margin-top:0;">Crea tareas, asigna a alumno o a todos, y califica entregas.</p>

      <label>Alumno *</label>
      <select id="alumnoSelect">
        <option value="__ALL__">Todos los alumnos</option>
        ${alumnos.map((a) => `<option value="${a.id}">${escapeHTML(a.nombre)}</option>`).join("")}
      </select>

      <label>Nombre *</label>
      <input id="nombre" placeholder="Ej. Tarea de investigación" />

      <label>Descripción</label>
      <textarea id="descripcion" placeholder="Instrucciones para el alumno..."></textarea>

      <label>Materia</label>
      <select id="materia">
        <option>Matemáticas</option>
        <option>Ciencias</option>
        <option>Lengua</option>
      </select>

      <label>Tipo</label>
      <select id="tipo">
        <option>Reporte</option>
        <option>Proyecto</option>
        <option>Examen</option>
      </select>

      <label>Fecha inicio</label>
      <input type="date" id="inicio" />

      <label>Fecha fin</label>
      <input type="date" id="fin" />

      <label>Prioridad</label>
      <select id="prioridad">
        <option>baja</option>
        <option>media</option>
        <option>alta</option>
      </select>

      <div class="hr"></div>

      <button id="guardar" class="btn" type="button">${editandoId ? "Guardar cambios" : "Guardar"}</button>
      <button id="limpiar" class="btn2" type="button" style="margin-top:10px;">Limpiar</button>

      <p class="small">Tip: filtra por <b>Entregadas</b> para calificar más rápido.</p>
    `;

    const alumnoSelect = document.getElementById("alumnoSelect");
    const nombre = document.getElementById("nombre");
    const descripcion = document.getElementById("descripcion");
    const materia = document.getElementById("materia");
    const tipo = document.getElementById("tipo");
    const inicio = document.getElementById("inicio");
    const fin = document.getElementById("fin");
    const prioridad = document.getElementById("prioridad");

    const guardarBtn = document.getElementById("guardar");
    const limpiarBtn = document.getElementById("limpiar");

    if (editandoId) {
      const t = gestor.tareas.find((x) => x.id === editandoId);
      if (t) {
        alumnoSelect.value = t.alumnoId; // edición es por-tarea (una sola)
        nombre.value = t.nombre;
        descripcion.value = t.descripcion;
        materia.value = t.materia;
        tipo.value = t.tipo;
        inicio.value = t.fechaInicio;
        fin.value = t.fechaFin;
        prioridad.value = t.prioridad;
      }
    } else {
      alumnoSelect.value = "__ALL__"; // por default: todos
    }

    guardarBtn.onclick = async () => {
      try {
        const target = alumnoSelect.value; // "__ALL__" o id alumno

        const baseData = {
          nombre: nombre.value,
          descripcion: descripcion.value,
          materia: materia.value,
          tipo: tipo.value,
          fechaInicio: inicio.value,
          fechaFin: fin.value,
          prioridad: prioridad.value,
        };

        // Si estamos editando, se mantiene igual (edita solo esa tarea)
        if (editandoId) {
          const old = gestor.tareas.find((t) => t.id === editandoId);

          const tareaData = {
            id: editandoId,
            alumnoId: old?.alumnoId,
            ...baseData,
            estado: old?.estado || "pendiente",
            entrega: old?.entrega || null,
            calificacion: old?.calificacion || null,
          };

          await gestor.editar(tareaData);
          editandoId = null;
        } else {
          // ✅ NUEVO: si el profe elige TODOS, se crean copias para cada alumno
          if (target === "__ALL__") {
            const now = Date.now();
            const nuevas = alumnos.map((a, idx) =>
              new Tarea({
                id: now + idx, // ids distintos
                alumnoId: a.id, // asignada a cada alumno
                ...baseData,
                estado: "pendiente",
              })
            );
            await gestor.agregarMuchas(nuevas);
          } else {
            // asignación normal a un alumno
            await gestor.agregar(
              new Tarea({
                id: Date.now(),
                alumnoId: target,
                ...baseData,
                estado: "pendiente",
              })
            );
          }
        }

        // limpiar inputs
        nombre.value = "";
        descripcion.value = "";
        inicio.value = "";
        fin.value = "";
        prioridad.value = "baja";
        alumnoSelect.value = "__ALL__";

        render();
        renderSidebar();
      } catch (e) {
        alert(e.message);
      }
    };

    limpiarBtn.onclick = () => {
      editandoId = null;
      renderSidebar();
    };
  } else {
    sidebar.innerHTML = `
      <h3 style="margin:0 0 8px;">🧑‍🎓 Panel Alumno</h3>
      <p class="small" style="margin-top:0;">Selecciona tu sesión para ver y entregar tareas.</p>

      <label>Alumno (sesión)</label>
      <select id="alumnoSesion">
        ${alumnos.map((a) => `<option value="${a.id}">${escapeHTML(a.nombre)}</option>`).join("")}
      </select>

      <div class="hr"></div>

      <p class="small"><b>Cómo entregar:</b> abre una tarea y presiona <b>Entregar</b>.</p>
      <p class="small">En esta demo se guarda solo el <b>nombre del archivo</b> en localStorage.</p>
    `;

    const alumnoSesion = document.getElementById("alumnoSesion");
    alumnoSesion.value = alumnoSesionId;
    alumnoSesion.onchange = () => {
      alumnoSesionId = alumnoSesion.value;
      filtroAlumno.value = alumnoSesionId;
      render();
    };
  }
};

/* =================== Render filtros =================== */
const renderFiltroAlumno = () => {
  if (rol === "profesor") {
    filtroAlumno.innerHTML = `
      <option value="">Todos los alumnos</option>
      ${alumnos.map((a) => `<option value="${a.id}">${escapeHTML(a.nombre)}</option>`).join("")}
    `;
  } else {
    filtroAlumno.innerHTML = `<option value="${alumnoSesionId}">${escapeHTML(alumnoNombre(alumnoSesionId))}</option>`;
    filtroAlumno.value = alumnoSesionId;
  }
};

/* =================== Render lista =================== */
const render = () => {
  renderFiltroAlumno();

  const estado = filtroEstado;
  const texto = buscar.value;
  const alumnoId = filtroAlumno.value || "";
  const finalAlumnoId = rol === "alumno" ? alumnoSesionId : alumnoId;

  const tareas = gestor.filtrar({ estado, texto, alumnoId: finalAlumnoId });

  if (!tareas.length) {
    lista.innerHTML = `
      <div class="task" style="text-align:center;">
        <b>No hay tareas con esos filtros</b>
        <p class="small">Prueba cambiar estado o borrar el texto de búsqueda.</p>
      </div>
    `;
    return;
  }

  lista.innerHTML = tareas
    .map((t) => {
      // ✅ CAMBIO: profesor puede calificar cuando está ENTREGADA o REVISADA (para editar calificación)
      const showCalificar = rol === "profesor" && (t.estado === "entregada" || t.estado === "revisada");

      const showEntregar = rol === "alumno" && (t.estado === "pendiente" || t.estado === "entregada");

      // lo dejamos igual: no permitir editar la tarea si ya está revisada
      const showEditar = rol === "profesor" && t.estado !== "revisada";

      const showEliminar = rol === "profesor";

      return `
      <article class="task">
        <div class="badges">
          <span class="badge materia">${escapeHTML(t.materia)}</span>
          <span class="badge prioridad ${escapeHTML(t.prioridad)}">${escapeHTML(t.prioridad)}</span>
          <span class="badge estado ${escapeHTML(t.estado)}">${escapeHTML(t.estado)}</span>
          <span class="badge">${escapeHTML(alumnoNombre(t.alumnoId))}</span>
        </div>

        <h4 style="margin:6px 0 4px;">${escapeHTML(t.nombre)}</h4>
        <small>${escapeHTML(t.fechaInicio || "—")} → ${escapeHTML(t.fechaFin || "—")}</small>

        ${t.descripcion ? `<p>${escapeHTML(t.descripcion)}</p>` : `<p class="small">Sin descripción</p>`}

        ${
          t.entrega
            ? `<p class="small"><b>Entrega:</b> ${escapeHTML(t.entrega.fileName)} • ${new Date(t.entrega.submittedAt).toLocaleString(
                "es-MX"
              )}</p>`
            : ""
        }

        ${
          t.calificacion
            ? `<p class="small"><b>Calificación:</b> ${escapeHTML(t.calificacion.score)} • ${new Date(t.calificacion.gradedAt).toLocaleString(
                "es-MX"
              )}<br/>
               <b>Retro:</b> ${escapeHTML(t.calificacion.feedback || "—")}</p>`
            : ""
        }

        <div class="actions">
          ${showEditar ? `<button class="editar" data-edit="${t.id}" type="button">Editar</button>` : ""}

          ${
            showCalificar
              ? `<button class="calificar" data-grade="${t.id}" type="button">
                   ${t.estado === "revisada" ? "Editar calificación" : "Calificar"}
                 </button>`
              : ""
          }

          ${
            showEntregar
              ? `<button class="entregar" data-submit="${t.id}" type="button">${t.entrega ? "Editar entrega" : "Entregar"}</button>`
              : ""
          }

          ${showEliminar ? `<button class="eliminar" data-del="${t.id}" type="button">Eliminar</button>` : ""}
        </div>
      </article>
    `;
    })
    .join("");
};

/* =================== Delegación de eventos =================== */
lista.onclick = async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const idEdit = btn.dataset.edit ? Number(btn.dataset.edit) : null;
  const idDel = btn.dataset.del ? Number(btn.dataset.del) : null;
  const idGrade = btn.dataset.grade ? Number(btn.dataset.grade) : null;
  const idSubmit = btn.dataset.submit ? Number(btn.dataset.submit) : null;

  if (idDel) {
    await gestor.eliminar(idDel);
    render();
    return;
  }

  if (idEdit) {
    const t = gestor.tareas.find((x) => x.id === idEdit);
    if (!t) return;
    editandoId = t.id;
    rol = "profesor";
    document.getElementById("btnProfesor").classList.add("active");
    document.getElementById("btnAlumno").classList.remove("active");
    renderSidebar();
    render();
    return;
  }

  if (idSubmit) {
    const t = gestor.tareas.find((x) => x.id === idSubmit);
    if (!t) return;

    if (rol !== "alumno" || t.alumnoId !== alumnoSesionId) {
      alert("Solo puedes entregar tus propias tareas en vista Alumno.");
      return;
    }

    openModal({
      title: "Entregar tarea (Alumno)",
      okText: "Enviar",
      bodyHTML: `
        <p class="small"><b>${escapeHTML(t.nombre)}</b></p>
        <label>Archivo</label>
        <input id="fileInput" type="file" />
        <p class="small">Demo: se guardará el nombre del archivo.</p>
      `,
      onOk: async (close) => {
        const file = document.getElementById("fileInput")?.files?.[0];
        if (!file) {
          alert("Selecciona un archivo.");
          return;
        }
        await gestor.entregar(idSubmit, file.name);
        close();
        render();
      },
    });
    return;
  }

  if (idGrade) {
    const t = gestor.tareas.find((x) => x.id === idGrade);
    if (!t) return;

    openModal({
      title: t.estado === "revisada" ? "Editar calificación (Profesor)" : "Calificar (Profesor)",
      okText: "Guardar",
      bodyHTML: `
        <p class="small"><b>${escapeHTML(t.nombre)}</b> • ${escapeHTML(alumnoNombre(t.alumnoId))}</p>
        ${
          t.entrega
            ? `<p class="small"><b>Archivo:</b> ${escapeHTML(t.entrega.fileName)}</p>`
            : `<p class="small">Aún no hay entrega.</p>`
        }

        <div class="row">
          <div>
            <label>Calificación (0-100)</label>
            <input id="score" type="number" min="0" max="100" value="${t.calificacion?.score ?? 100}" />
          </div>
          <div>
            <label>Estado</label>
            <input value="revisada" disabled />
          </div>
        </div>

        <label>Retroalimentación</label>
        <textarea id="feedback" placeholder="Ej. Buen trabajo, pero faltó bibliografía.">${escapeHTML(
          t.calificacion?.feedback ?? ""
        )}</textarea>
      `,
      onOk: async (close) => {
        const score = Number(document.getElementById("score").value || 0);
        const feedback = (document.getElementById("feedback").value || "").trim();
        await gestor.calificar(idGrade, Math.max(0, Math.min(100, score)), feedback);
        close();
        render();
      },
    });
  }
};

/* =================== Filtros =================== */
document.querySelectorAll(".filters button").forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll(".filters button").forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    filtroEstado = b.dataset.estado;
    render();
  };
});

buscar.oninput = render;
filtroAlumno.onchange = render;

/* =================== Cambiar Rol =================== */
const setRol = (next) => {
  rol = next;
  editandoId = null;

  document.getElementById("btnProfesor").classList.toggle("active", rol === "profesor");
  document.getElementById("btnAlumno").classList.toggle("active", rol === "alumno");

  if (rol === "alumno") filtroAlumno.value = alumnoSesionId;
  else filtroAlumno.value = "";

  renderSidebar();
  render();
};

document.getElementById("btnProfesor").onclick = () => setRol("profesor");
document.getElementById("btnAlumno").onclick = () => setRol("alumno");

/* =================== Boot =================== */
(async () => {
  await gestor.cargar();

  if (!gestor.tareas.length) {
    await gestor.agregar(
      new Tarea({
        id: Date.now(),
        alumnoId: "a1",
        nombre: "Ejercicios de Matemáticas",
        descripcion: "Resolver del 1 al 10.",
        materia: "Matemáticas",
        tipo: "Actividad",
        fechaInicio: "",
        fechaFin: "",
        prioridad: "media",
        estado: "pendiente",
      })
    );

    await gestor.agregar(
      new Tarea({
        id: Date.now() + 1,
        alumnoId: "a2",
        nombre: "Reporte de Ciencias",
        descripcion: "Investiga el ciclo del agua y entrega un reporte.",
        materia: "Ciencias",
        tipo: "Reporte",
        fechaInicio: "",
        fechaFin: "",
        prioridad: "alta",
        estado: "pendiente",
      })
    );
  }

  renderSidebar();
  renderFiltroAlumno();
  render();
})();
