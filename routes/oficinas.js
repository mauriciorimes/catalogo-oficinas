const express = require('express');
const createError = require('http-errors');
const oficinasModel = require('../model/oficinas');

const router = express.Router();

const MENSAGEM_ERRO = 'Preencha todos os campos. A carga horária deve ser um número inteiro de 1 a 40.';

function lerFormulario(body) {
  return {
    titulo: (body.titulo || '').trim(),
    responsavel: (body.responsavel || '').trim(),
    descricao: (body.descricao || '').trim(),
    cargaHoraria: Number(body.cargaHoraria),
  };
}

function formularioValido(dados) {
  return dados.titulo !== '' &&
    dados.responsavel !== '' &&
    dados.descricao !== '' &&
    Number.isInteger(dados.cargaHoraria) &&
    dados.cargaHoraria >= 1 &&
    dados.cargaHoraria <= 40;
}

router.get('/nova', function(req, res, next) {
  res.render('nova', { title: 'Nova Oficina', menuNova: true });
});

router.post('/nova', async function(req, res, next) {
  const dados = lerFormulario(req.body);
  if (!formularioValido(dados)) {
    return res.render('nova', { title: 'Nova Oficina', menuNova: true, oficina: req.body, erro: MENSAGEM_ERRO });
  }
  await oficinasModel.cadastrar(dados);
  res.redirect('/');
});

router.get('/pesquisa', function(req, res, next) {
  res.render('pesquisa', { title: 'Pesquisa de Oficinas', menuPesquisa: true });
});

router.post('/pesquisa', async function(req, res, next) {
  const termo = (req.body.termo || '').trim();
  if (termo === '') {
    return res.render('pesquisa', { title: 'Pesquisa de Oficinas', menuPesquisa: true });
  }
  const oficinas = await oficinasModel.pesquisarPorTitulo(termo);
  res.render('pesquisa', { title: 'Pesquisa de Oficinas', menuPesquisa: true, pesquisou: true, termo, oficinas });
});

router.get('/:id', async function(req, res, next) {
  const oficina = await oficinasModel.buscarPorId(Number(req.params.id));
  if (!oficina) {
    return next(createError(404, 'Oficina não encontrada'));
  }
  res.render('consulta', { title: 'Consulta de Oficina', oficina });
});

router.get('/:id/editar', async function(req, res, next) {
  const oficina = await oficinasModel.buscarPorId(Number(req.params.id));
  if (!oficina) {
    return next(createError(404, 'Oficina não encontrada'));
  }
  res.render('editar', { title: 'Editar Oficina', oficina });
});

router.post('/:id/editar', async function(req, res, next) {
  const id = Number(req.params.id);
  const oficina = await oficinasModel.buscarPorId(id);
  if (!oficina) {
    return next(createError(404, 'Oficina não encontrada'));
  }
  const dados = lerFormulario(req.body);
  if (!formularioValido(dados)) {
    return res.render('editar', { title: 'Editar Oficina', oficina: { ...req.body, id }, erro: MENSAGEM_ERRO });
  }
  await oficinasModel.atualizar(id, dados);
  res.redirect('/');
});

router.post('/:id/alternar', async function(req, res, next) {
  const oficina = await oficinasModel.alternarInscricoes(Number(req.params.id));
  if (!oficina) {
    return next(createError(404, 'Oficina não encontrada'));
  }
  res.redirect('/');
});

router.post('/:id/excluir', async function(req, res, next) {
  await oficinasModel.excluir(Number(req.params.id));
  res.redirect('/');
});

module.exports = router;
