const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = new FormData(formulario);
  const dados = Object.fromEntries(email.entries());

  const [[dbEmail, dbSenha] = []] = await execute(
    "SELECT Email, Senha FROM Client WHERE Email = ?",
    [dados.email],
    CONFIG,
  );

  if (!dbEmail) {
    window.alert("Nenhum usuário cadastrado com essas credenciais...");
    return;
  }

  if (dbSenha !== dados.senha) {
    window.alert("Senha incorreta...");
    return;
  }

  window.alert("Usuário autenticado");

  formulario.reset();
  localStorage.setItem("usuarioLogado", true);
  window.location.href = "home.html";
});
