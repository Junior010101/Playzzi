const login = document.getElementById("loginUsuario");

formulario.addEventListener("submit", function(e){
    e.preventDefault();

    const email = new FormData(formulario);
    const dados = Object.fromEntries(email.entries())

    const [dbEmail, dbSenha] = execute("SELECT Email, Senha FROM User WHERE Email = ? ", [dados.email], CONFIG,);

    console.log(dbEmail, dbSenha)

});
