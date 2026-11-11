const formulario = document.getElementById("formularioUsuario");

function validarUsuario(nome, senha) {
  if (nome.length < 4 || nome.length > 255) {
    window.alert("Seu nome tem poucos caracteres.");
    return false;
  }
  if (senha.length < 8 || senha.length > 30) {
    window.alert("Senha incorreta! Tente Novamente.");
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

  execute(
    "INSERT INTO Client (Name, Email, Senha) VALUES (?, ?, ?)",
    [dados.nome, dados.email, dados.senha],
    CONFIG,
  );

  window.alert("Seu cadastro foi realizado com sucesso");
  formulario.reset();
});
