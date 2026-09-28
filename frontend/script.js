// URL base da API. Vazio = mesma origem (json-server com --static).
// Se a página for aberta via file://, usa o json-server local.
// Na Parte 5, trocar por o URL da API no Render.
const API_BASE = location.protocol.startsWith("http") ? "" : "http://localhost:3000";

const state = { alunos: [], cursos: [], filtroCurso: "", editingId: null, pendingDeleteId: null };

const $ = (id) => document.getElementById(id);
const form = $("aluno-form");
const fields = ["nome", "apelido", "idCurso", "anoCurricular", "idade"];

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`${options.method ?? "GET"} ${path} falhou (${res.status})`);
  return res.status === 204 ? null : res.json();
}

function showFeedback(message, isError = false) {
  const el = $("feedback");
  el.textContent = message;
  el.classList.toggle("is-error", isError);
  el.hidden = false;
  clearTimeout(showFeedback.timer);
  showFeedback.timer = setTimeout(() => (el.hidden = true), 4000);
}

const nomeCurso = (id) => state.cursos.find((c) => c.id === id)?.nomeDoCurso ?? "—";

// ---------- Renderização ----------
function renderCursos() {
  const opcoes = state.cursos.map((c) => new Option(c.nomeDoCurso, c.id));

  const selForm = $("idCurso");
  selForm.replaceChildren(new Option("Selecionar…", ""), ...opcoes);

  const selFiltro = $("filtro-curso");
  selFiltro.replaceChildren(
    new Option("Todos os cursos", ""),
    ...state.cursos.map((c) => new Option(c.nomeDoCurso, c.id))
  );
  selFiltro.value = state.filtroCurso;
}

function renderAlunos() {
  const visiveis = state.filtroCurso
    ? state.alunos.filter((a) => String(a.idCurso) === state.filtroCurso)
    : state.alunos;

  const rows = visiveis.map((a) => {
    const tr = document.createElement("tr");
    if (a.id === state.editingId) tr.classList.add("editing");

    for (const valor of [a.id, `${a.nome} ${a.apelido}`, nomeCurso(a.idCurso), `${a.anoCurricular}.º`, a.idade ?? "—"]) {
      tr.append(Object.assign(document.createElement("td"), { textContent: valor }));
    }

    const actions = document.createElement("td");
    actions.className = "row-actions";
    actions.append(
      button("Editar", "btn btn-sm", () => startEdit(a.id), `Editar ${a.nome} ${a.apelido}`),
      button("Apagar", "btn btn-sm btn-link-danger", () => askDelete(a), `Apagar ${a.nome} ${a.apelido}`)
    );
    tr.append(actions);
    return tr;
  });

  $("alunos-body").replaceChildren(...rows);
  $("count").textContent = `(${visiveis.length})`;
  $("empty").hidden = visiveis.length > 0;
}

function button(text, className, onClick, ariaLabel) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = className;
  b.textContent = text;
  b.setAttribute("aria-label", ariaLabel);
  b.addEventListener("click", onClick);
  return b;
}

// ---------- Formulário ----------
function readForm() {
  return {
    nome: $("nome").value.trim(),
    apelido: $("apelido").value.trim(),
    idCurso: $("idCurso").value,
    anoCurricular: $("anoCurricular").value,
    idade: $("idade").value,
  };
}

function validate(v) {
  const errors = {};
  if (v.nome.length < 2) errors.nome = "Indica o nome (mín. 2 caracteres).";
  if (v.apelido.length < 2) errors.apelido = "Indica o apelido (mín. 2 caracteres).";
  if (!v.idCurso) errors.idCurso = "Escolhe um curso.";
  if (!v.anoCurricular) errors.anoCurricular = "Escolhe o ano curricular.";
  if (v.idade !== "" && !(Number(v.idade) >= 16 && Number(v.idade) <= 99)) errors.idade = "Idade entre 16 e 99.";
  return errors;
}

function showErrors(errors) {
  for (const name of fields) {
    const msg = errors[name] ?? "";
    document.querySelector(`[data-error-for="${name}"]`).textContent = msg;
    $(name).setAttribute("aria-invalid", msg ? "true" : "false");
  }
  const first = fields.find((n) => errors[n]);
  if (first) $(first).focus();
}

function toPayload(v) {
  const payload = {
    nome: v.nome,
    apelido: v.apelido,
    idCurso: Number(v.idCurso),
    anoCurricular: Number(v.anoCurricular),
  };
  if (v.idade !== "") payload.idade = Number(v.idade);
  return payload;
}

function resetForm() {
  form.reset();
  state.editingId = null;
  $("aluno-id").value = "";
  $("form-title").textContent = "Adicionar aluno";
  $("submit-btn").textContent = "Adicionar";
  $("cancel-btn").hidden = true;
  showErrors({});
  renderAlunos();
}

function startEdit(id) {
  const a = state.alunos.find((x) => x.id === id);
  if (!a) return;
  state.editingId = id;
  $("aluno-id").value = id;
  $("nome").value = a.nome;
  $("apelido").value = a.apelido;
  $("idCurso").value = a.idCurso;
  $("anoCurricular").value = a.anoCurricular;
  $("idade").value = a.idade ?? "";
  $("form-title").textContent = `Editar aluno #${id}`;
  $("submit-btn").textContent = "Guardar alterações";
  $("cancel-btn").hidden = false;
  showErrors({});
  renderAlunos();
  form.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  $("nome").focus();
}

async function onSubmit(event) {
  event.preventDefault();
  const values = readForm();
  const errors = validate(values);
  showErrors(errors);
  if (Object.keys(errors).length) return;

  const submitBtn = $("submit-btn");
  submitBtn.disabled = true;
  try {
    const payload = toPayload(values);
    if (state.editingId !== null) {
      await api(`/alunos/${state.editingId}`, { method: "PUT", body: JSON.stringify({ id: state.editingId, ...payload }) });
      showFeedback("Aluno atualizado.");
    } else {
      await api("/alunos", { method: "POST", body: JSON.stringify(payload) });
      showFeedback("Aluno adicionado.");
    }
    await loadAlunos();
    resetForm();
  } catch (err) {
    showFeedback(err.message, true);
  } finally {
    submitBtn.disabled = false;
  }
}

// ---------- Remoção com confirmação ----------
function askDelete(aluno) {
  state.pendingDeleteId = aluno.id;
  $("confirm-text").textContent = `Tens a certeza que queres remover ${aluno.nome} ${aluno.apelido}? Esta ação não pode ser desfeita.`;
  $("confirm-dialog").showModal();
}

async function onConfirmClose() {
  const dialog = $("confirm-dialog");
  const id = state.pendingDeleteId;
  state.pendingDeleteId = null;
  if (dialog.returnValue !== "ok" || id === null) return;
  try {
    await api(`/alunos/${id}`, { method: "DELETE" });
    if (state.editingId === id) resetForm();
    await loadAlunos();
    showFeedback("Aluno removido.");
  } catch (err) {
    showFeedback(err.message, true);
  }
}

// ---------- Carregamento ----------
async function loadAlunos() {
  state.alunos = await api("/alunos");
  renderAlunos();
}

async function init() {
  try {
    [state.cursos, state.alunos] = await Promise.all([api("/cursos"), api("/alunos")]);
    renderCursos();
    renderAlunos();
  } catch (err) {
    showFeedback(`Não foi possível contactar a API. ${err.message}`, true);
  }
}

form.addEventListener("submit", onSubmit);
$("cancel-btn").addEventListener("click", resetForm);
$("filtro-curso").addEventListener("change", (e) => {
  state.filtroCurso = e.target.value;
  renderAlunos();
});
$("confirm-dialog").addEventListener("close", onConfirmClose);
init();
