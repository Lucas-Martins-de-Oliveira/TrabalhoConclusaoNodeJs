const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const controllerPessoa = require('../controllers/pessoa-controller');

const PessoaModel = mongoose.model('Pessoa');

//irá trazer a lista e a quantidade de registros
router.get('/', controllerPessoa.get_all_pessoas);

//irá buscar uma pessoa pelo id
router.get('/info/:pessoaId', async (req, res, next) => {
    const id = req.params.pessoaId;

    try {
        const pessoa = await PessoaModel.findOne({_id: id});
        if (pessoa) {
            res.status(200).json({
                pessoa: pessoa,
                request: {
                  type: "GET",
                  url: "http://localhost:3000/pessoas"
                }
              });
        } else {
            res.status(404).json("Pessoa não existe!");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//irá salvar uma nova Pessoa
router.post('/salvarPessoa', controllerPessoa.salvar_pessoa);

//irá excluir a Pessoa
router.delete('/:PessoaId', controllerPessoa.excluir_pessoa);

module.exports = router;