const express = require('express');
const oficinasModel = require('../model/oficinas');

const router = express.Router();

router.get('/', async function(req, res, next) {
  const oficinas = await oficinasModel.listar();
  const resumo = await oficinasModel.resumo();
  res.render('index', { title: 'Oficinas cadastradas', menuInicio: true, oficinas, resumo });
});

router.get('/abertas', async function(req, res, next) {
  const oficinas = await oficinasModel.listarAbertas();
  const resumo = await oficinasModel.resumo();
  res.render('index', { title: 'Oficinas cadastradas', menuInicio: true, somenteAbertas: true, oficinas, resumo });
});

router.get('/sobre', function(req, res, next) {
  res.render('sobre', { title: 'Sobre o catálogo', menuSobre: true });
});

module.exports = router;
