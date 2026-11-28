const params = new URLSearchParams(window.location.search);
const form = document.getElementById("quiz");
const button = document.getElementById("quiz-button");

let quizData = JSON.parse(localStorage.getItem("quizData") || "null");
let quizState = JSON.parse(localStorage.getItem("quizState") || "null");

const TEMPO_POR_QUESTAO = 30;
const PONTOS_POR_ACERTO = 100;
let timerIntervalId = null;

/**
 * Formata uma quantidade de segundos no padrão MM:SS.
 * @param {number} segundos - Quantidade de segundos a ser formatada.
 * @returns {string} Tempo formatado em MM:SS.
 */
const formatarTimer = (segundos) => {
  const seguro = Math.max(0, Math.floor(Number(segundos) || 0));
  const mins = String(Math.floor(seguro / 60)).padStart(2, "0");
  const secs = String(seguro % 60).padStart(2, "0");

  return `${mins}:${secs}`;
};

/**
 * Interrompe o intervalo ativo do timer, se houver.
 * @returns {void}
 */
const stopTimer = () => {
  if (timerIntervalId !== null) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
};

/**
 * Bloqueia as alternativas, aplica a classe visual de tempo esgotado e atualiza o botão.
 * @param {number|string} questaoId - Identificador da questão atual.
 * @returns {void}
 */
const aplicarTempoEsgotado = (questaoId) => {
  stopTimer();

  const feedback = document.getElementById("feedback");
  const timerEl = document.getElementById("quiz-timer");

  if (timerEl) timerEl.textContent = formatarTimer(0);

  form.querySelectorAll('input[name="option"]').forEach((input) => {
    input.disabled = true;
  });

  form.querySelectorAll(".quiz__option").forEach((label) => {
    label.classList.remove("is-correct", "is-wrong");
    label.classList.add("is-pending");
  });

  // Se o usuário não respondeu e o tempo acabou, permite avançar/finalizar no submit
  const jaTemResposta = Boolean(quizState?.respostas?.[questaoId]);
  if (!jaTemResposta && button) {
    const totalQuestoes = getIssues(quizData).length;
    feedback.style.display = "block";
    button.textContent =
      quizState.questaoAtual >= totalQuestoes ? "Finalizar" : "Próxima questão";
  }
};

/**
 * Inicia ou retoma o timer regressivo de uma questão com persistência no quizState.
 * @param {number|string} questaoId - Identificador da questão atual.
 * @param {number} [duracaoSegundos=TEMPO_POR_QUESTAO] - Duração máxima da questão em segundos.
 * @returns {void}
 */
const startTimer = (questaoId, duracaoSegundos = TEMPO_POR_QUESTAO) => {
  stopTimer();

  const timerEl = document.getElementById("quiz-timer");
  const respostaSalva = quizState?.respostas?.[questaoId];
  const tempoSalvo = quizState?.tempos?.[questaoId];

  // Se já foi respondida, mostra o tempo gasto (ou restante salvo) e não roda
  if (respostaSalva) {
    if (timerEl && typeof tempoSalvo === "number") {
      timerEl.textContent = formatarTimer(tempoSalvo);
    }
    return;
  }

  // Se o tempo já havia acabado nessa questão antes do F5
  if (tempoSalvo === 0 || quizState?.tempoEsgotadoId === questaoId) {
    aplicarTempoEsgotado(questaoId);
    return;
  }

  const inicio = quizState?.timerInicio ?? Date.now();
  if (!quizState?.timerInicio) {
    saveState({
      ...quizState,
      timerInicio: inicio,
    });
  }

  const tick = () => {
    const decorrido = Math.floor((Date.now() - inicio) / 1000);
    const restante = Math.max(0, duracaoSegundos - decorrido);

    if (timerEl) {
      timerEl.textContent = formatarTimer(restante);
    }

    if (restante <= 0) {
      saveState({
        ...quizState,
        timerInicio: null,
        tempoEsgotadoId: questaoId,
        tempos: {
          ...(quizState.tempos || {}),
          [questaoId]: 0,
        },
      });
      aplicarTempoEsgotado(questaoId);
    }
  };

  tick();
  timerIntervalId = setInterval(tick, 1000);
};

/**
 * Cria o objeto inicial do estado da partida para o quiz informado.
 * @param {number|string} quizId - ID do quiz atual.
 * @returns {{ quizId: number, questaoAtual: number, respostas: Object, tempos: Object, timerInicio: number|null, tempoEsgotadoId: number|string|null, finalizado: boolean }} Estado inicial da sessão.
 */
const initState = (quizId) => ({
  quizId: Number(quizId),
  questaoAtual: 1,
  respostas: {},
  tempos: {},
  timerInicio: null,
  tempoEsgotadoId: null,
  finalizado: false,
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
      "SELECT * FROM vw_quiz WHERE quiz_id = ?",
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
    const questaoId = row[3];
    if (!mapa.has(questaoId)) {
      mapa.set(questaoId, {
        questaoId,
        enunciado: row[4],
        explicacao: row[5],
        alternativas: [],
      });
    }

    mapa.get(questaoId).alternativas.push({
      numero: Number(row[6]),
      texto: row[7],
      correta: Number(row[8]) === 1,
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

  stopTimer();
  clearQuizCache();
  window.location.href = page;
};

/**
 * Valida o parâmetro ?q= e o cache local, busca o quiz no banco quando necessário, renderiza e restaura o estado da questão.
 * @returns {Promise<void>}
 */
const initQuiz = async () => {
  const rawQ = params.get("q");
  const quizId = rawQ ? decodeId(rawQ) : null;

  if (rawQ !== null && !quizId) {
    window.location.href = "403.html";
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
    const idAtivo = Number(quizId || cachedQuizId);

    if (!quizState || Number(quizState.quizId) !== idAtivo) {
      saveState(initState(idAtivo));
    }

    const questoes = getIssues(quizData);
    const questao = questoes[quizState.questaoAtual - 1];

    renderQuiz(questao, questoes.length);
    applyState(questao.questaoId, quizState?.respostas?.[questao.questaoId]);
    startTimer(questao.questaoId);
    return;
  }

  if (!quizId) {
    window.location.href = "403.html";
    return;
  }

  clearQuizCache();

  const data = await fetchQuiz(quizId);
  if (!data) return;

  quizData = data;
  localStorage.setItem("quizData", JSON.stringify(data));
  saveState(initState(quizId));

  const questoes = getIssues(quizData);
  const questao = questoes[quizState.questaoAtual - 1];

  renderQuiz(questao, questoes.length);
  applyState(questao.questaoId, quizState?.respostas?.[questao.questaoId]);
  startTimer(questao.questaoId);
};

/**
 * Renderiza a questão atual e suas alternativas embaralhadas na interface.
 * @param {Object} [questao] - Dados da questão a ser exibida.
 * @param {number} [totalQuestoes] - Quantidade total de questões do quiz.
 * @returns {void}
 */
const renderQuiz = (questao, totalQuestoes) => {
  if (!questao) return;

  const progress = document.getElementById("progress-bar");
  const tittle = document.getElementById("quiz-title");
  const issue = document.getElementById("quiz-issue");
  const prompt = document.getElementById("question-stem");
  const feedback = document.getElementById("feedback");

  const renderAlternativas = (alternativas, questaoId) => {
    const container = document.querySelector(".quiz__options");

    container.replaceChildren();

    const fragment = document.createDocumentFragment();

    const opcoesEmbaralhadas = [...alternativas];

    for (let i = opcoesEmbaralhadas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opcoesEmbaralhadas[i], opcoesEmbaralhadas[j]] = [
        opcoesEmbaralhadas[j],
        opcoesEmbaralhadas[i],
      ];
    }

    opcoesEmbaralhadas.forEach((alt, index) => {
      const inputId = `q-${questaoId}-opt-${alt.numero ?? index + 1}`;

      const label = document.createElement("label");
      label.className = "quiz__option";
      label.htmlFor = inputId;

      const input = document.createElement("input");
      input.className = "quiz__marker";
      input.type = "radio";
      input.name = "option";
      input.id = inputId;
      input.value = String(alt.numero ?? index + 1);
      input.dataset.correta = String(Boolean(alt.correta));
      input.required = true;

      const span = document.createElement("span");
      span.textContent = alt.texto;

      label.append(input, span);
      fragment.append(label);
    });

    container.append(fragment);
  };

  const title = quizData[0]?.[1];

  document.title = `${title} – Playzzi`;
  tittle.textContent = `Quiz: ${title}`;

  issue.textContent = `Pergunta ${quizState.questaoAtual} de ${totalQuestoes}`;

  const pct =
    totalQuestoes > 0
      ? Math.round((quizState.questaoAtual / totalQuestoes) * 100)
      : 0;

  progress.value = pct;
  progress.textContent = `${pct}%`;

  prompt.textContent = questao.enunciado;

  feedback.textContent = questao.explicacao;

  renderAlternativas(questao.alternativas || [], questao.questaoId);
};

/**
 * Aplica ou restaura o feedback visual, o estado de seleção/bloqueio dos radios e o texto do botão conforme a resposta salva.
 * @param {number|string} id - ID da questão atual.
 * @param {{ opcao: string|null, acertou: boolean }|undefined} respostaMarcada - Resposta persistida para a questão, se houver.
 * @returns {void}
 */
const applyState = (id, respostaMarcada) => {
  const feedback = document.getElementById("feedback");
  const inputs = Array.from(form.querySelectorAll('input[name="option"]'));
  const totalQuestoes = getIssues(quizData).length;
  const ehUltima = quizState?.questaoAtual >= totalQuestoes;
  const tempoEsgotado =
    quizState?.tempoEsgotadoId === id || quizState?.tempos?.[id] === 0;

  form.querySelectorAll(".quiz__option").forEach((label) => {
    label.classList.remove("is-correct", "is-wrong", "is-pending");
  });

  inputs.forEach((input) => {
    input.disabled = false;
    input.checked = false;
  });

  if (!respostaMarcada) {
    if (tempoEsgotado) {
      aplicarTempoEsgotado(id);
      return;
    }
    if (button) {
      feedback.style.display = "none";
      button.textContent = "Responder";
    }
    return;
  }

  const inputMarcado = inputs.find(
    (input) => String(input.value) === String(respostaMarcada.opcao),
  );

  if (inputMarcado) {
    inputMarcado.checked = true;
    const alternativa = inputMarcado.closest("label");
    alternativa?.classList.add(
      respostaMarcada.acertou ? "is-correct" : "is-wrong",
    );
  }

  inputs.forEach((input) => {
    input.disabled = true;
  });

  if (button) {
    feedback.style.display = "block";
    button.textContent = ehUltima ? "Finalizar" : "Próxima questão";
  }
};

/**
 * Calcula a pontuação inteira da partida com base nas respostas corretas e nos tempos gastos.
 * @param {Object<string|number, { opcao: string|null, acertou: boolean }>} respostas - Mapa de respostas por questão.
 * @param {Object<string|number, number>} tempos - Mapa de segundos gastos por questão.
 * @param {number} [pontosPorAcerto=PONTOS_POR_ACERTO] - Pontos base por questão correta.
 * @returns {number} Pontuação total inteira (>= 0).
 */
const calcularPontuacao = (
  respostas = {},
  tempos = {},
  pontosPorAcerto = 100,
) => {
  let total = 0;

  for (const [questaoId, resp] of Object.entries(respostas || {})) {
    if (!resp?.acertou) continue;

    const tempoGasto = Number(tempos?.[questaoId] ?? TEMPO_POR_QUESTAO);
    const bonusTempo = Math.max(0, TEMPO_POR_QUESTAO - tempoGasto);

    total += pontosPorAcerto + bonusTempo;
  }

  return Math.max(0, Math.round(total));
};

/**
 * Calcula o percentual de acertos (0.0 a 100.0) em relação ao total de questões do quiz.
 * @param {number} acertos - Quantidade de questões acertadas.
 * @param {number} totalQuestoes - Quantidade total de questões do quiz.
 * @returns {number} Percentual com até 2 casas decimais entre 0 e 100.
 */
const calcularPercentual = (acertos = 0, totalQuestoes = 0) => {
  const total = Number(totalQuestoes) || 0;
  const certos = Math.max(0, Number(acertos) || 0);

  if (total <= 0) return 0;

  const pct = (certos / total) * 100;
  return Number(Math.min(100, Math.max(0, pct)).toFixed(2));
};

/**
 * Consolida o placar da partida e grava o registro na tabela Tentativa.
 * @param {number|string} [client_id] - ID do cliente, caso não venha do storage.
 * @param {number|string} [quiz_id] - ID do quiz, caso não venha do estado/cache.
 * @param {Object} [respostas=quizState?.respostas] - Mapa de respostas por questão.
 * @param {Object} [tempos=quizState?.tempos] - Mapa de tempos gastos por questão.
 * @returns {Promise<Object|undefined>} Resumo salvo ou undefined se faltar identificador.
 */
const finishQuiz = async (client_id, quiz_id, respostas, tempos) => {
  stopTimer();

  const cliente = Number(client_id);
  const quiz = Number(quiz_id);
  const questoes = getIssues(quizData);
  const totalQuestoes = questoes.length;

  let acertos = 0;
  let erros = 0;

  for (const questao of questoes) {
    const resp = respostas?.[questao.questaoId];

    if (resp && resp.acertou) {
      acertos += 1;
    } else {
      erros += 1;
    }
  }

  const pontuacao = calcularPontuacao(respostas, tempos);
  const percentual = calcularPercentual(acertos, totalQuestoes);

  if (!cliente || !quiz) {
    console.warn("Identificadores inválidos para registrar tentativa:", {
      cliente,
      quiz,
    });
    return;
  }

  try {
    await execute(
      `INSERT INTO Tentativa (
        cliente_id,
        quiz_id,
        pontuacao,
        percentual,
        acertos,
        erros
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(cliente_id, quiz_id) DO UPDATE SET
        pontuacao = excluded.pontuacao,
        percentual = excluded.percentual,
        acertos = excluded.acertos,
        erros = excluded.erros,
        criado_em = CURRENT_TIMESTAMP`,
      [cliente, quiz, pontuacao, percentual, acertos, erros],
      CONFIG,
    );

    saveState({
      ...quizState,
      timerInicio: null,
      finalizado: true,
    });

    clearQuizCache();

    window.location.href = `score.html?q=${encodeURIComponent(encodeId(quiz))}`;

    return {
      cliente_id: cliente,
      quiz_id: quiz,
      pontuacao,
      percentual,
      acertos,
      erros,
    };
  } catch (e) {
    console.error("Erro ao salvar tentativa:", e);
    window.alert("Não foi possível salvar o resultado. Tente novamente.");
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dadosUsuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  const questoes = getIssues(quizData);
  const questaoAtualObj = questoes[quizState.questaoAtual - 1];

  if (quizState?.respostas?.[questaoAtualObj.questaoId]) {
    const proximo = quizState.questaoAtual + 1;

    if (proximo <= questoes.length) {
      saveState({
        ...quizState,
        questaoAtual: proximo,
        timerInicio: null,
        tempoEsgotadoId: null,
      });

      const proximaQuestao = questoes[proximo - 1];
      renderQuiz(proximaQuestao, questoes.length);
      applyState(
        proximaQuestao.questaoId,
        quizState?.respostas?.[proximaQuestao.questaoId],
      );
      startTimer(proximaQuestao.questaoId);
    } else {
      const idUsuario = decodeId(dadosUsuario?.id);
      const idQuiz = quizState.quizId;
      const respostas = quizState.respostas;
      const tempos = quizState.tempos;

      await finishQuiz(idUsuario, idQuiz, respostas, tempos);
    }

    return;
  }

  // Se o tempo já esgotou nessa questão sem resposta, deixa o clique avançar/finalizar
  if (
    quizState?.tempoEsgotadoId === questaoAtualObj.questaoId ||
    quizState?.tempos?.[questaoAtualObj.questaoId] === 0
  ) {
    const proximo = quizState.questaoAtual + 1;

    if (proximo <= questoes.length) {
      saveState({
        ...quizState,
        questaoAtual: proximo,
        timerInicio: null,
        tempoEsgotadoId: null,
      });

      const proximaQuestao = questoes[proximo - 1];
      renderQuiz(proximaQuestao, questoes.length);
      applyState(
        proximaQuestao.questaoId,
        quizState?.respostas?.[proximaQuestao.questaoId],
      );
      startTimer(proximaQuestao.questaoId);
    } else {
      const idUsuario = decodeId(dadosUsuario?.id);
      const idQuiz = quizState.quizId;
      const respostas = quizState.respostas;
      const tempos = quizState.tempos;

      await finishQuiz(idUsuario, idQuiz, respostas, tempos);
    }

    return;
  }

  const dados = Object.fromEntries(new FormData(form).entries());
  const inicio = quizState?.timerInicio || Date.now();

  const tempoGasto = Math.min(
    TEMPO_POR_QUESTAO,
    Math.max(0, Math.floor((Date.now() - inicio) / 1000)),
  );

  stopTimer();

  form.querySelectorAll('input[name="option"]').forEach((input) => {
    input.disabled = true;
  });

  const alternativaEscolhida = questaoAtualObj?.alternativas.find(
    (alt) => String(alt.numero) === String(dados.option),
  );

  const acertou = Boolean(alternativaEscolhida?.correta);

  const respostas = {
    ...(quizState.respostas || {}),
    [questaoAtualObj.questaoId]: {
      opcao: String(dados.option),
      acertou,
    },
  };

  saveState({
    ...quizState,
    timerInicio: null,
    tempoEsgotadoId: null,
    respostas,
    tempos: {
      ...(quizState.tempos || {}),
      [questaoAtualObj.questaoId]: tempoGasto,
    },
  });

  applyState(questaoAtualObj.questaoId, respostas[questaoAtualObj.questaoId]);
});

initQuiz();
