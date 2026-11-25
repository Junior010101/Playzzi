const formulario = document.getElementById("cadastroForm");

formulario.addEventListener("submit", async function (e) {
  e.preventDefault();

  const dados = Object.fromEntries(new FormData(formulario).entries());
  const nomeLimpo = (dados.nome || "").trim();
  const emailLimpo = (dados.email || "").trim().toLowerCase();
  const senha = dados.senha || "";
  const confirmarSenha = dados.confirmarSenha || "";

  if (!validarNomeUsuario(nomeLimpo)) {
    return;
  }

  if (!validarSenhaUsuario(senha)) {
    return;
  }

  if (!validarSenhas(senha, confirmarSenha)) {
    return;
  }

  try {
    await execute(
      "INSERT INTO Cliente (nome, email, senha) VALUES (?, ?, ?)",
      [nomeLimpo, emailLimpo, senha],
      CONFIG,
    );
  } catch (error) {
    console.error(error);

    if (!validarEmail(error)) {
      return;
    }

    window.alert("Erro ao conectar com o banco de dados. Tente novamente.");
    return;
  }

  window.alert("Seu cadastro foi realizado com sucesso");
  formulario.reset();
  window.location.href = "login.html";
});
