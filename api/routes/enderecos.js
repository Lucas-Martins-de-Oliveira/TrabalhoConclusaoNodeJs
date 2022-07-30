const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const controllerEndereco = require('../controllers/endereco-controller');

const EnderecoModel = mongoose.model('Endereco');
const PessoaModel = mongoose.model('Pessoa');

//irá trazer a lista e a quantidade de endereços
router.get('/', controllerEndereco.get_all_enderecos);

//irá buscar um endereço pelo id
router.get('/info/:enderecoId', async (req, res, next) => {
    const id = req.params.enderecoId;

    try {
        const endereco = await EnderecoModel.findOne({_id: id});
        if (endereco) {
            res.status(200).json({
                endereco: endereco,
                request: {
                  type: "GET",
                  url: "http://localhost:3000/enderecos"
                }
              });
        } else {
            res.status(404).json("Endereço não existe!");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//irá salvar um novo endereço
router.post('/salvarEndereco', controllerEndereco.salvar_endereco);

//irá excluir o Endereço
router.delete('/:enderecoId', controllerEndereco.excluir_endereco);

module.exports = router;