const oficinas = [];
let proximoId = 1;

async function listar() {
  return oficinas;
}

async function listarAbertas() {
  return oficinas.filter((oficina) => oficina.inscricoesAbertas);
}

async function buscarPorId(id) {
  return oficinas.find((oficina) => oficina.id === id);
}

async function pesquisarPorTitulo(termo) {
  const termoMinusculo = termo.toLowerCase();
  return oficinas.filter((oficina) => oficina.titulo.toLowerCase().includes(termoMinusculo));
}

async function cadastrar(dados) {
  const oficina = {
    id: proximoId,
    titulo: dados.titulo,
    responsavel: dados.responsavel,
    descricao: dados.descricao,
    cargaHoraria: dados.cargaHoraria,
    inscricoesAbertas: true,
  };
  proximoId++;
  oficinas.push(oficina);
  return oficina;
}

async function atualizar(id, dados) {
  const oficina = await buscarPorId(id);
  if (oficina) {
    oficina.titulo = dados.titulo;
    oficina.responsavel = dados.responsavel;
    oficina.descricao = dados.descricao;
    oficina.cargaHoraria = dados.cargaHoraria;
  }
  return oficina;
}

async function alternarInscricoes(id) {
  const oficina = await buscarPorId(id);
  if (oficina) {
    oficina.inscricoesAbertas = !oficina.inscricoesAbertas;
  }
  return oficina;
}

async function excluir(id) {
  const posicao = oficinas.findIndex((oficina) => oficina.id === id);
  if (posicao !== -1) {
    oficinas.splice(posicao, 1);
  }
}

async function resumo() {
  const abertas = oficinas.filter((oficina) => oficina.inscricoesAbertas);
  return {
    total: oficinas.length,
    abertas: abertas.length,
    encerradas: oficinas.length - abertas.length,
    cargaHorariaAbertas: abertas.reduce((soma, oficina) => soma + oficina.cargaHoraria, 0),
  };
}

module.exports = {
  listar,
  listarAbertas,
  buscarPorId,
  pesquisarPorTitulo,
  cadastrar,
  atualizar,
  alternarInscricoes,
  excluir,
  resumo,
};
