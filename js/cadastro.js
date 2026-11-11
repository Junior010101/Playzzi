const formulario = document.getElementById("formularioUsuario");

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const objeto = new FormData(formulario);
  const dados = Object.fromEntries(objeto.entries());

  execute("INSERT INTO Client (Name, Email, Senha) VALUES (?, ?, ?)", [dados.nome, dados.email, dados.senha], CONFIG);
 
  formulario.reset()
});


function validarUsuario(){
  const senha = document.getElementById("senha");
  if (senha < 8 || senha >30);
  window.alert("Senha incorreta! Tente Novamente.")

  const nome = document.getElementById("nome");
  if (nome < 4 || nome > 255);
  window.alert("Seu nome tem poucos caracteres.")

  window.alert("Seu cadastro foi realizado com sucesso")
};
