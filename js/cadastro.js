const formulario = document.getElementById("cadastroForm");

function validarUsuario(nome, senha) {
  if (!nome || nome.length < 4 || nome.length > 255) {
    window.alert("O nome deve ter entre 4 e 255 caracteres.");
    return false;
  }
  if (!senha || senha.length < 8 || senha.length > 255) {
    window.alert("A senha deve ser maior que 8 e menor que 30 caracteres.");
    return false;
  }

  return true;
}

function validarSenhas(senha, confirmarSenha) {
  if (confirmarSenha !== senha) {
    window.alert("As senhas não coincidem.");
    return false;
  }

  return true;
}

formulario.addEventListener("submit", async function (e) {
  e.preventDefault();

  const dados = Object.fromEntries(new FormData(formulario).entries());
  const nomeLimpo = (dados.nome || "").trim();
  const emailLimpo = (dados.email || "").trim().toLowerCase();
  const senha = dados.senha || "";
  const confirmarSenha = dados.confirmarSenha || "";

  if (!validarUsuario(nomeLimpo, emailLimpo, senha)) {
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
    const msg = String(error?.message || "");
    if (msg.includes("UNIQUE")) {
      window.alert("Este e-mail já está cadastrado.");
    } else {
      window.alert("Erro ao conectar com o banco de dados. Tente novamente.");
    }
    return;
  }

  window.alert("Seu cadastro foi realizado com sucesso");
  formulario.reset();
  window.location.href = "login.html";
});
