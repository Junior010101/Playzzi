const dadosUsuario = JSON.parse(
  localStorage.getItem("usuarioLogado") || "null",
);

const form = document.getElementById("form-usuario");
const inputName = document.getElementById("username");
const inputEmail = document.getElementById("email");
const inputSenha = document.getElementById("password");

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

form.addEventListener("submit", async function (evento) {
  evento.preventDefault();
  const dados = Object.fromEntries(new FormData(form).entries());

  const nome = dados.nome?.trim();
  const email = dados.email?.trim();
  const senha = dados.senha;

  let campos = [];
  let valores = [];

  if (nome) {
    if (!validarNomeUsuario(nome)) {
      return;
    }

    campos.push("nome = ?");
    valores.push(nome);
  }

  if (email) {
    campos.push("email = ?");
    valores.push(email);
  }

  if (senha) {
    if (!validarSenhaUsuario(senha)) {
      return;
    }

    campos.push("senha = ?");
    valores.push(senha);
  }

  if (campos.length === 0) {
    window.alert("Sem dados para alterar.");
    return;
  }

  if (!dadosUsuario?.id) {
    window.alert("Usuário não identificado.");
    return;
  }

  valores.push(dadosUsuario.id);

  try {
    await execute(
      `UPDATE Cliente SET ${campos.join(", ")} WHERE id = ?`,
      valores,
      CONFIG,
    );

    if (nome) dadosUsuario.nome = nome;
    if (email) dadosUsuario.email = email;
    localStorage.setItem("usuarioLogado", JSON.stringify(dadosUsuario));

    form.reset();
    exibirDados();
  } catch (error) {
    if (!validarEmail(error)) {
      return;
    }

    console.error("Erro ao atualizar usuário:", error);
    window.alert("Erro ao conectar com o banco de dados. Tente novamente.");
  }
});

function exibirDados() {
  if (!dadosUsuario) return;
  inputName.placeholder = dadosUsuario.nome;
  inputEmail.placeholder = dadosUsuario.email;
  inputSenha.placeholder = "•".repeat(dadosUsuario.senha.length);
}

exibirDados();
