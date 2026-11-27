const params = new URLSearchParams(window.location.search);
let quizData = JSON.parse(localStorage.getItem("quizData") || "null");
let quizState = JSON.parse(localStorage.getItem("quizState") || "null");

/**
 * Cria o objeto inicial do estado da partida para o quiz informado.
 * @param {number|string} quizId - ID do quiz atual.
 * @returns {{ quizId: number, questaoAtual: number }} Estado inicial da sessão.
 */
const initState = (quizId) => ({
  quizId: Number(quizId),
  questaoAtual: 0,
});

/**
 * Atualiza o estado em memória e salva no localStorage como JSON.
 * @param {Object} novoEstado - Objeto de estado da partida a ser persistido.
 * @returns {void}
 */
const saveState = (novoEstado) => {
  quizState = novoEstado;
  localStorage.setItem("quizState", JSON.stringify(novoEstado));
};

/**
 * Remove quizData e quizState do localStorage e zera as variáveis em memória.
 * @returns {void}
 */
const clearQuizCache = () => {
  localStorage.removeItem("quizData");
  localStorage.removeItem("quizState");
  quizData = null;
  quizState = null;
};

/**
 * Busca as linhas de um quiz na view vw_quiz; em erro ou vazio, alerta e redireciona para home.html.
 * @param {number|string} id - ID do quiz no banco.
 * @returns {Promise<Array<Array<*>>|null>} Matriz de linhas do quiz ou null em caso de falha.
 */
const fetchQuiz = async (id) => {
  try {
    const data = await execute(
      "SELECT * FROM vw_quiz WHERE quiz_id = ? ORDER BY questao_id ASC, n_alternativa ASC",
      [id],
      CONFIG,
    );

    if (!data || data.length === 0) {
      window.alert("Quiz não encontrado.");
      window.location.href = "home.html";
      return null;
    }

    return data;
  } catch (e) {
    console.error(e);
    window.alert("Erro ao conectar com o banco de dados. Tente novamente.");
    window.location.href = "home.html";
    return null;
  }
};

/**
 * Agrupa a matriz plana da vw_quiz por questao_id em objetos estruturados de questão.
 * @param {Array<Array<*>>} linhas - Matriz retornada pela consulta em vw_quiz.
 * @returns {Array<{ questaoId: *, enunciado: *, explicacao: *, alternativas: Array<{ numero: number, texto: *, correta: boolean }> }>} Lista de questões agrupadas.
 */
const getIssues = (linhas) => {
  if (!Array.isArray(linhas)) return [];

  const mapa = new Map();

  for (const row of linhas) {
    const questaoId = row[8];
    if (!mapa.has(questaoId)) {
      mapa.set(questaoId, {
        questaoId,
        enunciado: row[9],
        explicacao: row[10],
        alternativas: [],
      });
    }

    mapa.get(questaoId).alternativas.push({
      numero: Number(row[11]),
      texto: row[12],
      correta: Number(row[13]) === 1,
    });
  }

  return Array.from(mapa.values());
};

/**
 * Pede confirmação ao usuário; se aceitar, limpa o cache do quiz e redireciona para a página indicada.
 * @param {string} page - Caminho/URL de destino.
 * @returns {void}
 */
const navigateTo = (page) => {
  const choice = window.confirm("Tem certeza que deseja sair do quiz?");

  if (!choice) {
    return;
  }

  clearQuizCache();
  window.location.href = page;
};

/**
 * Valida o parâmetro ?q= e o cache local, busca o quiz no banco quando necessário e inicia a tela.
 * @returns {Promise<void>}
 */
const initQuiz = async () => {
  const rawQ = params.get("q");
  const quizId = rawQ ? decodeId(rawQ) : null;

  if (rawQ !== null && !quizId) {
    window.location.href = "home.html";
    return;
  }

  const cachedQuizId =
    Array.isArray(quizData) && quizData.length > 0 ? quizData[0]?.[0] : null;

  const precisaBuscar =
    !quizData ||
    !Array.isArray(quizData) ||
    quizData.length === 0 ||
    (quizId && cachedQuizId && Number(cachedQuizId) !== Number(quizId));

  if (!precisaBuscar) {
    return;
  }

  if (!quizId) {
    window.location.href = "home.html";
    return;
  }

  clearQuizCache();

  const data = await fetchQuiz(quizId);
  if (!data) return;

  quizData = data;
  localStorage.setItem("quizData", JSON.stringify(data));
  renderQuiz();
};

/**
 * Renderiza a questão atual e suas alternativas na interface.
 * @param {Object} [questao] - Dados da questão a ser exibida (se passado diretamente).
 * @returns {void}
 */
const renderQuiz = (questao) => {};

initQuiz();
