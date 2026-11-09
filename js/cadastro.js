const formulario = document.getElementById("formularioUsuario");

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const objeto = new FormData(formulario);
  const dados = Object.fromEntries(objeto.entries());

  execute("INSERT INTO Client (Name, Email, Senha) VALUES (?, ?, ?)", [dados.nome, dados.email, dados.senha], CONFIG);
 
  formulario.reset()
});

