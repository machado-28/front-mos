export const validatePassporte = /^\w{3}\d{6}$/;

export const validatePersonNames =
  /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(?:[ \u00c0-\u00ff\u00f1\u00d1'-][a-zA-ZÀ-ÿ\u00f1\u00d1]+)*$/;
// Esta regex permite os seguintes padrões para um nome:

// Pode começar com uma letra maiúscula ou minúscula.
// Pode conter letras maiúsculas e minúsculas, incluindo acentos (como À-ÿ), a letra ñ (minúscula e maiúscula) e o caractere de apóstrofo (').
// Pode conter espaços em branco (mas não consecutivos), permitindo que nomes compostos sejam aceitos.
// Não pode começar ou terminar com um espaço em branco.
// Não pode conter caracteres especiais como números, símbolos ou caracteres de pontuação (exceto o apóstrofo para nomes como O'Connor, por exemplo).

export class ValidateData {
  byInterval({ date = new Date(), interval = 3 }) {
    date.setMonth(date.getMonth() + interval);
    return date;
  }
}
export function verificarIdade(dataNascimento) {
  const idade = calcularIdade(dataNascimento);
  return idade >= 18;
}
export function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesAtual = hoje.getMonth() + 1;
  const diaAtual = hoje.getDate();
  const mesNascimento = nascimento.getMonth() + 1;
  const diaNascimento = nascimento.getDate();

  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
    idade--;
  }
  console.log(idade);
  return idade;
}

export function capitalize(str) {
  return str.toLowerCase().replace(/^\w|\s\w/g, (letter) => letter.toUpperCase());
}

export function formatDateDifference(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60)); // Diferença em minutos

  if (diff < 1) {
    return "agora mesmo";
  } else if (diff < 60) {
    return `há ${diff} minuto${diff > 1 ? "s" : ""}`;
  } else if (diff < 1440) {
    // 60 minutos * 24 horas = 1440 minutos
    const hours = Math.floor(diff / 60);
    return `há ${hours} hora${hours > 1 ? "s" : ""}`;
  } else if (diff < 43200) {
    // 1440 minutos * 30 dias = 43200 minutos
    const days = Math.floor(diff / 1440);
    return `há ${days} dia${days > 1 ? "s" : ""}`;
  } else {
    return date.toLocaleDateString("pt-BR"); // Se for mais antigo, mostra a data completa
  }
}
