const formulario = document.getElementById("cadastroForm");

function validarUsuario(nome, senha) {
  if (nome.length < 4 || nome.length > 255) {
    window.alert("O nome deve ter entre 4 e 255 caracteres.");
    return false;
  }
  if (senha.length < 8 || senha.length > 30) {
    window.alert("A senha deve ser maior que 8 e menor que 30 caracteres.");
    return false;
  }

  return true;
}

function validarSenhas(senha, confirmarSenha) {
  if (confirmarSenha && confirmarSenha !== senha) {
    window.alert("As senhas não coincidem.");
    return false;
  }

  return true;
}

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const objeto = new FormData(formulario);
  const dados = Object.fromEntries(objeto.entries());

  if (!validarUsuario(dados.nome, dados.senha)) {
    return;
  }

  if (!validarSenhas(dados.senha, dados.confirmarSenha)) {
    return;
  }

  execute(
    "INSERT INTO Client (Name, Email, Senha) VALUES (?, ?, ?)",
    [dados.nome, dados.email, dados.senha],
    CONFIG,
  );

  window.alert("Seu cadastro foi realizado com sucesso");
  formulario.reset();
  window.location.href = "login.html";
});
