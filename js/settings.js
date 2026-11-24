const form = document.getElementById("form-usuario");
const inputName = document.getElementById("username");
const inputEmail = document.getElementById("email");

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
  const dadosUsuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  let campos = [];
  let valores = [];

  if (dados.nome) {
    campos.push("nome = ?");
    valores.push(dados.nome);
  }

  if (dados.email) {
    campos.push("email = ?");
    valores.push(dados.email);
  }

  if (dados.senha) {
    campos.push("senha = ?");
    valores.push(senha);
  }

  valores.push(dadosUsuario.id);

  if (valores.length <= 0) {
    window.alert("Sem dados para alterar.");
    return;
  }

  try {
    await execute(
      `UPDATE Cliente SET ${campos.join(" , ")} WHERE id= ? ; `,
      valores,
      CONFIG,
    );
  } catch (error) {
    console.log(error);
  }
});

function exibirDados() {
  const dados = JSON.parse(localStorage.getItem("usuarioLogado"));
  inputName.placeholder = dados.nome;
  inputEmail.placeholder = dados.email;
}

exibirDados();
