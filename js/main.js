/**
 * Playzzi - Script Interativo
 * Controla a interatividade do Quiz, navegação suave e comportamento de acordeão
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
      feedback: "Isso mesmo! Aqui, você aprende na prática e desenvolve novas habilidades com quizzes e desafios.",
      options: [
        { text: "Aprender com quizzes e desafios, no seu próprio ritmo.", correct: true },
        { text: "Decorar conceitos sem colocar o conhecimento em prática.", correct: false },
        { text: "Estudar apenas programação, sem explorar outras áreas.", correct: false },
        { text: "Seguir um ritmo único, sem espaço para novas descobertas.", correct: false }
      ],
      meta: "Sobre • Nossa proposta • 1/5"
    },
    {
      step: 2,
      total: 5,
      question: "Para quem a plataforma do Playzzi foi idealizada?",
      feedback: "Perfeito! O Playzzi é feito para qualquer pessoa curiosa que queira começar sem medo de errar.",
      options: [
        { text: "Para iniciantes e entusiastas que querem aprender se divertindo.", correct: true },
        { text: "Apenas para quem já possui diploma na área de computação.", correct: false },
        { text: "Somente para programadores seniores com anos de experiência.", correct: false },
        { text: "Apenas para pessoas que já dominam todas as linguagens.", correct: false }
      ],
      meta: "Público • Nossa proposta • 2/5"
    },
    {
      step: 3,
      total: 5,
      question: "O que você desenvolve enquanto joga no Playzzi?",
      feedback: "Excelente! Estimulamos raciocínio lógico, criatividade e solução de problemas reais.",
      options: [
        { text: "Raciocínio lógico, criatividade e resolução de problemas.", correct: true },
        { text: "Apenas memorização rápida de sintaxe sem contexto.", correct: false },
        { text: "Acúmulo de horas de tela sem aprendizado prático.", correct: false },
        { text: "Apenas leitura passiva de teorias complexas.", correct: false }
      ],
      meta: "Habilidades • Nossa proposta • 3/5"
    }
  ];

  let currentQuestionIndex = 0;

  function loadQuestion(index) {
    const q = questions[index];
    if (!q) return;

    if (questionTitle) questionTitle.textContent = q.question;
    if (feedbackText) feedbackText.textContent = q.feedback;
    if (progressLabel) progressLabel.textContent = `Pergunta ${q.step} de ${q.total}`;
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

      if (optData.correct) {
        optionEl.classList.add("quiz__option--selected");
        if (radioEl) radioEl.checked = true;
      } else {
        optionEl.classList.remove("quiz__option--selected");
        if (radioEl) radioEl.checked = false;
      }
    });
  }

  // Clique em uma opção do quiz
  quizOptions.forEach((option) => {
    option.addEventListener("click", () => {
      quizOptions.forEach((opt) => opt.classList.remove("quiz__option--selected"));
      option.classList.add("quiz__option--selected");

      const radio = option.querySelector(".quiz__radio");
      if (radio) radio.checked = true;
    });
  });

  // Próxima pergunta
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
      loadQuestion(currentQuestionIndex);
    });
  }

  // 2. Navegação com rolagem suave compensando o Header fixo
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || !targetId) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = document.querySelector(".header")?.offsetHeight || 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight + 10;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });
});
