const params = new URLSearchParams(window.location.search);
let currentQuizId = null;

const cameFromQuiz = () => {
  if (!document.referrer) return false;

  try {
    const referrerUrl = new URL(document.referrer);
    return (
      referrerUrl.pathname.endsWith("/quiz.html") ||
      referrerUrl.pathname === "quiz.html"
    );
  } catch {
    return false;
  }
};

const fetchResults = async () => {
  try {
    const data = await execute("SELECT * FROM vw_resultado", [], CONFIG);
    return data;
  } catch (e) {
    console.error(e);
    window.alert("Erro ao conectar com o banco de dados.");
    return null;
  }
};

/**
 * Renderiza a lista do ranking geral a partir das linhas retornadas pela view.
 * @param {Array<Array<*>>} rows - Matriz de resultados ordenada por pontuação decrescente.
 * @param {number|string} currentUserId - ID do usuário atual para destaque no ranking.
 * @returns {void}
 */
const renderRanking = (rows, currentUserId) => {
  const container = document.querySelector("[data-ranking-list]");
  if (!container || !Array.isArray(rows)) return;

  container.replaceChildren();

  const fragment = document.createDocumentFragment();
  const alvoUsuario = Number(currentUserId);

  rows.forEach((row, index) => {
    const posicao = index + 1;
    const clienteId = Number(row[0]);
    const jogadorNome = row[1];
    const pontuacao = Number(row[5] || 0);
    const ehAtual = clienteId === alvoUsuario;

    const li = document.createElement("li");
    li.className = "ranking__item";

    if (posicao === 1) li.classList.add("ranking__item--first");
    else if (posicao === 2) li.classList.add("ranking__item--second");
    else if (posicao === 3) li.classList.add("ranking__item--third");

    if (ehAtual) {
      li.classList.add("ranking__item--current");
      li.setAttribute("aria-current", "true");
    }

    const posSpan = document.createElement("span");
    posSpan.className = "ranking__position";
    posSpan.setAttribute("aria-label", `${posicao}º lugar`);
    posSpan.textContent = String(posicao);

    const playerSpan = document.createElement("span");
    playerSpan.className = "ranking__player";
    playerSpan.textContent = jogadorNome;

    const scoreSpan = document.createElement("span");
    scoreSpan.className = "ranking__score";
    scoreSpan.textContent = `${pontuacao.toLocaleString("pt-BR")} `;

    const unitAbbr = document.createElement("abbr");
    unitAbbr.className = "ranking__unit";
    unitAbbr.title = "pontos";
    unitAbbr.textContent = "pts";

    scoreSpan.append(unitAbbr);
    li.append(posSpan, playerSpan, scoreSpan);
    fragment.append(li);
  });

  container.append(fragment);
};

const renderScore = async () => {
  const dadosUsuario = JSON.parse(
    localStorage.getItem("usuarioLogado") || "null",
  );

  if (!dadosUsuario) {
    window.location.href = "403.html";
  }

  // if (!cameFromQuiz()) {
  //   window.location.href = "403.html";
  //   return;
  // }

  const rawQ = params.get("q");

  const quizId = rawQ ? decodeId(rawQ) : null;
  const userId = dadosUsuario ? decodeId(dadosUsuario?.id) : null;

  if (rawQ !== null && !quizId) {
    window.location.href = "403.html";
    return;
  }

  if (!userId) {
    window.location.href = "403.html";
    return;
  }

  const results = await fetchResults();

  renderRanking(results, userId);

  const match = results.find(
    (row) =>
      Number(row[0]) === Number(userId) &&
      (!quizId || Number(row[2]) === Number(quizId)),
  );

  if (!match) return;

  const [
    client_id,
    jogador_nome,
    quiz_id,
    quiz_titulo,
    quiz_area,
    pontuacao,
    percentual,
    acertos,
    erros,
  ] = match;

  currentQuizId = Number(quiz_id);

  const client = document.getElementById("player");
  const quiz = document.getElementById("quiz");
  const categoria = document.getElementById("categoria");
  const hits = document.getElementById("hits");
  const errors = document.getElementById("errors");
  const points = document.getElementById("points");
  const percent = document.getElementById("percent");

  document.title = `${quiz_titulo} – Score - Playzzi`;
  client.textContent = jogador_nome;
  quiz.textContent = quiz_titulo;
  categoria.textContent = quiz_area;
  hits.textContent = acertos;
  errors.textContent = erros;
  points.textContent = `${pontuacao} pts`;
  percent.textContent = `${percentual}%`;
};

const navigateTo = (page) => {
  if (page === "quiz.html") {
    window.location.href = `quiz.html?q=${encodeURIComponent(encodeId(currentQuizId))}`;
  } else {
    window.location.href = page;
  }
};

renderScore();
