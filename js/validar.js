function validarNomeUsuario(nome) {
  if (!nome || nome.length < 4 || nome.length > 255) {
    window.alert("O nome deve ter entre 4 e 255 caracteres.");
    return false;
  }

  return true;
}

function validarSenhaUsuario(senha) {
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

function validarEmail(error) {
  const msg = String(error?.message || "");

  if (msg.includes("UNIQUE")) {
    window.alert("Este e-mail já está cadastrado.");
    return false;
  }

  return true;
}
