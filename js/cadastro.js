const formulario = document.getElementById("formularioUsuario");

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const objeto = new FormData(formulario);
  const dados = Object.fromEntries(objeto.entries());

  console.log(dados.nome);
});
