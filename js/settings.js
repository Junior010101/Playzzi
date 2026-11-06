document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".settings-form__toggle-btn").forEach((btn) => {
    const targetId = btn.getAttribute("aria-controls");
    const input = document.getElementById(targetId);

    if (!input) return;

    btn.addEventListener("click", () => {
      const isVisible = input.type === "text";

      // Alterna o tipo do input
      input.type = isVisible ? "password" : "text";

      // Atualiza estados de acessibilidade
      btn.setAttribute(
        "aria-label",
        isVisible ? "Mostrar senha" : "Ocultar senha",
      );
      btn.setAttribute("aria-pressed", String(!isVisible));

      // Alterna uma classe no botão para o CSS controlar a visibilidade dos ícones
      btn.classList.toggle("is-visible", !isVisible);
    });
  });
});
