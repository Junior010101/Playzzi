/**
- Playzzi - Script Interativo
- Controla a interatividade do Quiz, navegação suave e comportamento de acordeão
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Interatividade do Quiz
  const quizOptions = document.querySelectorAll(".quiz__option");
  const nextButton = document.querySelector(".quiz__btn-next");
  const progressBar = document.querySelector(".quiz__progress-bar");
  const progressLabel = document.querySelector(".quiz__progress-label");
  const progressTrack = document.querySelector(".quiz__progress-track");
  const questionTitle = document.querySelector(".quiz__question");
  const feedbackText = document.querySelector(".quiz__feedback");
  const metaText = document.querySelector(".quiz__meta");

  const questions = [
    {
      step: 1,
      total: 5,
      question: "Qual é a proposta do Playzzi para aprender tecnologia?",
      feedback:
        "Isso mesmo! Aqui, você aprende na prática e desenvolve novas habilidades com quizzes e desafios.",
      options: [
        {
          text: "Estudar apenas programação, sem explorar outras áreas.",
          correct: false,
        },
        {
          text: "Aprender com quizzes e desafios, no seu próprio ritmo.",
          correct: true,
        },
        {
          text: "Seguir um ritmo único, sem espaço para novas descobertas.",
          correct: false,
        },
        {
          text: "Decorar conceitos sem colocar o conhecimento em prática.",
          correct: false,
        },
      ],
      meta: "Sobre • Nossa proposta • 1/5",
    },
    {
      step: 2,
      total: 5,
      question: "Para quem a plataforma do Playzzi foi idealizada?",
      feedback:
        "Perfeito! O Playzzi é feito para qualquer pessoa curiosa que queira começar sem medo de errar.",
      options: [
        {
          text: "Apenas para quem já possui diploma na área de computação.",
          correct: false,
        },
        {
          text: "Para iniciantes e entusiastas que querem aprender se divertindo.",
          correct: true,
        },
        {
          text: "Somente para programadores seniores com anos de experiência.",
          correct: false,
        },
        {
          text: "Apenas para pessoas que já dominam todas as linguagens.",
          correct: false,
        },
      ],
      meta: "Público • Nossa proposta • 2/5",
    },
    {
      step: 3,
      total: 5,
      question: "O que você desenvolve enquanto joga no Playzzi?",
      feedback:
        "Excelente! Estimulamos raciocínio lógico, criatividade e solução de problemas reais.",
      options: [
        {
          text: "Acúmulo de horas de tela sem aprendizado prático.",
          correct: false,
        },
        {
          text: "Apenas leitura passiva de teorias complexas.",
          correct: false,
        },
        {
          text: "Raciocínio lógico, criatividade e resolução de problemas.",
          correct: true,
        },
        {
          text: "Apenas memorização rápida de sintaxe sem contexto.",
          correct: false,
        },
      ],
      meta: "Habilidades • Nossa proposta • 3/5",
    },
    {
      step: 4,
      total: 5,
      question:
        "Como o Playzzi torna o aprendizado de tecnologia mais acessível?",
      feedback:
        "Isso aí! Transformamos o estudo em uma experiência interativa e leve para todos.",
      options: [
        {
          text: "Transformando conceitos complexos em desafios interativos e leves.",
          correct: true,
        },
        {
          text: "Exigindo provas longas e exaustivas ao final de cada módulo.",
          correct: false,
        },
        {
          text: "Cobrando mensalidades caras por mentorias presenciais.",
          correct: false,
        },
        {
          text: "Disponibilizando apenas apostilas densas em formato PDF.",
          correct: false,
        },
      ],
      meta: "Metodologia • Nossa proposta • 4/5",
    },
    {
      step: 5,
      total: 5,
      question:
        "Qual é a principal vantagem de aprender tecnologia através de quizzes interativos?",
      feedback:
        "Exato! O feedback imediato ajuda a fixar o conteúdo e corrige rotas na hora.",
      options: [
        {
          text: "Receber feedback imediato e testar o conhecimento de forma dinâmica.",
          correct: true,
        },
        {
          text: "Esperar dias por uma correção manual dos exercícios.",
          correct: false,
        },
        {
          text: "Garantir que você nunca cometa nenhum erro durante os estudos.",
          correct: false,
        },
        {
          text: "Estudar obrigatoriamente em grupo com outras pessoas.",
          correct: false,
        },
      ],
      meta: "Vantagens • Nossa proposta • 5/5",
    },
  ];

  let currentQuestionIndex = 0;
  let isAnswered = false; // Controla o bloqueio das opções

  function loadQuestion(index) {
    const q = questions[index];
    if (!q) return;

    // Destrava o quiz e limpa as seleções anteriores para a nova pergunta
    isAnswered = false;

    if (questionTitle) questionTitle.textContent = q.question;
    if (feedbackText) feedbackText.textContent = q.feedback;
    if (progressLabel)
      progressLabel.textContent = `Pergunta ${q.step} de ${q.total}`;
    if (metaText) metaText.textContent = q.meta;

    const percent = (q.step / q.total) * 100;
    if (progressBar) progressBar.style.width = `${percent}%`;
    if (progressTrack) progressTrack.setAttribute("aria-valuenow", percent);

    quizOptions.forEach((optionEl, optIdx) => {
      const optData = q.options[optIdx];
      if (!optData) return;

      const textEl = optionEl.querySelector(".quiz__option-text");
      const radioEl = optionEl.querySelector(".quiz__radio");
      if (textEl) textEl.textContent = optData.text;

      // Remove todas as classes de seleção e erro, e desmarca o rádio
      optionEl.classList.remove(
        "quiz__option--selected",
        "quiz__option--incorrect",
      );
      if (radioEl) radioEl.checked = false;
    });
  }

  // Clique em uma opção do quiz
  quizOptions.forEach((option, optIdx) => {
    option.addEventListener("click", () => {
      // Se já foi respondido, ignora novos cliques (trava)
      if (isAnswered) return;

      isAnswered = true; // Trava o quiz até clicar em próxima

      const q = questions[currentQuestionIndex];
      const optData = q.options[optIdx];

      // Remove classes anteriores de todas as opções
      quizOptions.forEach((opt) =>
        opt.classList.remove(
          "quiz__option--selected",
          "quiz__option--incorrect",
        ),
      );

      const radio = option.querySelector(".quiz__radio");
      if (radio) radio.checked = true;

      // Verifica se a opção clicada é a correta
      if (optData && optData.correct) {
        // Se for correta, aplica a classe padrão de selecionado (verde no seu CSS)
        option.classList.add("quiz__option--selected");
      } else {
        // Se for incorreta, aplica uma classe de erro (vermelha)
        option.classList.add(
          "quiz__option--selected",
          "quiz__option--incorrect",
        );

        // Opcional: Se quiser revelar qual era a correta automaticamente:
        quizOptions.forEach((optEl, i) => {
          if (q.options[i].correct) {
            optEl.classList.add("quiz__option--selected");
          }
        });
      }
    });
  });

  // Próxima pergunta
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
      loadQuestion(currentQuestionIndex);
    });
  }
});
