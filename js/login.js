const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", async function (e) {
  e.preventDefault();
  
  let userId, userName, dbEmail, dbSenha;

  const dados = Object.fromEntries(new FormData(formulario).entries());
  const emailLimpo = (dados.email || "").trim().toLowerCase();
  
  try {
    [[userId, userName, dbEmail, dbSenha] = []] = await execute(
        "SELECT id, nome, email, senha FROM Cliente WHERE email = ?",
        [emailLimpo],
        CONFIG,
    );
  } catch (error) {
    console.error(error);
    window.alert("Erro ao conectar com o banco de dados. Tente novamente.");
    return;
  }

  if (!dbEmail) {
    window.alert("Usuário não encontrado...");
    return;
  }

  if (dbSenha !== dados.senha) {
    window.alert("Senha incorreta...");
    return;
  }

  window.alert("Usuário autenticado");

  formulario.reset();
  localStorage.setItem("usuarioLogado", JSON.stringify({
    id: userId, 
    nome: userName,
    email: dbEmail
  }));
  window.location.href = "home.html";
});

