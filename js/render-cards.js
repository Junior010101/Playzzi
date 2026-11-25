const cardContainer = document.getElementById("card-container");

const ICON_NAMES = {
  g: "ease",
  y: "medium",
  r: "hard",
};

const DIFFICULTY_MAP = {
  1: ["g", "g", "g"],
  2: ["g", "g", "y"],
  3: ["g", "y", "y"],
  4: ["y", "y", "y"],
  5: ["y", "y", "r"],
  6: ["y", "r", "r"],
  7: ["r", "r", "r"],
};

const updateCardContainer = async () => {
  let data;

  try {
    data = await execute(
      "SELECT id, titulo, descricao, dificuldade, area, imagem_url, mais_jogado, e_recente FROM Quiz ORDER BY criado_em ASC",
      [],
      CONFIG,
    );
  } catch (error) {
    console.error(error);
    window.alert("Erro ao conectar com o banco de dados. Tente novamente.");
    return;
  }

  localStorage.setItem("cardContainerData", JSON.stringify(data));
  renderCards("todas");
};

const getDifficultyLevel = (difficulty) => {
  const level = Number(difficulty);
  const codes = DIFFICULTY_MAP[level] || DIFFICULTY_MAP[1];

  return codes.map((code) => ICON_NAMES[code]);
};

const renderCards = (filtro) => {
  cardContainer.replaceChildren();

  const filtroAtivo =
    filtro ?? localStorage.getItem("cardContainerFilter") ?? "todas";

  if (filtro !== undefined) {
    localStorage.setItem("cardContainerFilter", filtro);
  }

  let containerData =
    JSON.parse(localStorage.getItem("cardContainerData")) || [];

  if (containerData.length === 0) {
    cardContainer.innerHTML = "<p>Sem quizes para renderizar...</p>";
    return;
  }

  if (filtroAtivo && filtroAtivo.toUpperCase() !== "TODAS") {
    let newContainerData = [];

    containerData.forEach((card) => {
      const area = String(card[4] || "").toUpperCase();

      if (filtroAtivo.toUpperCase() === area) {
        newContainerData.push(card);
      }
    });

    containerData = newContainerData;
  }

  if (containerData.length === 0) {
    cardContainer.innerHTML = "<p>Nenhum quiz encontrado para esse filtro.</p>";
    return;
  }

  containerData.forEach((card) => {
    const [
      id,
      titulo,
      descricao,
      dificuldade,
      area,
      imagemUrl,
      maisJogado,
      eRecente,
    ] = card;

    const article = document.createElement("article");
    article.classList.add("quiz-card");

    const cardMedia = document.createElement("div");
    cardMedia.classList.add("quiz-card__media");

    const img = document.createElement("img");
    img.src = `https://${imagemUrl}`;
    img.alt = "";
    img.ariaHidden = true;
    img.loading = "lazy";
    img.classList.add("quiz-card__img");

    const span = document.createElement("span");
    span.textContent = titulo;
    span.classList.add("quiz-card__tag");

    cardMedia.appendChild(img);
    cardMedia.appendChild(span);

    const cardContent = document.createElement("div");
    cardContent.classList.add("quiz-card__content");

    const p = document.createElement("p");
    p.textContent = descricao;
    p.classList.add("quiz-card__description");

    const cardFooter = document.createElement("div");
    cardFooter.classList.add("quiz-card__footer");

    const quizDificulty = document.createElement("div");
    quizDificulty.classList.add("quiz-card__difficulty");

    getDifficultyLevel(dificuldade).forEach((iconName) => {
      const diffIcon = document.createElement("img");
      diffIcon.src = `./assets/icons/${iconName}.svg`;
      diffIcon.alt = "";
      diffIcon.ariaHidden = true;
      diffIcon.classList.add("quiz-card__difficulty-icon");
      diffIcon.width = 26;
      diffIcon.height = 26;
      quizDificulty.appendChild(diffIcon);
    });

    const a = document.createElement("a");
    a.href = `quiz.html?q=${encodeURIComponent(encodeId(id))}`;
    a.textContent = "Jogar";
    a.classList.add("button", "button--primary", "quiz-card__btn");

    cardFooter.appendChild(quizDificulty);
    cardFooter.appendChild(a);

    cardContent.appendChild(p);
    cardContent.appendChild(cardFooter);

    article.appendChild(cardMedia);
    article.appendChild(cardContent);

    cardContainer.append(article);
  });
};

if (!localStorage.getItem("cardContainerFilter")) {
  localStorage.setItem("cardContainerFilter", "todas");
}
if (!localStorage.getItem("cardContainerData")) {
  updateCardContainer();
} else {
  renderCards();
}
