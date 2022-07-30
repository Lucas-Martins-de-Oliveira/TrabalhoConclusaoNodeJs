const mongoose = require('mongoose');
const PessoaModel = mongoose.model('Pessoa');

module.exports = {

    get_all_pessoas : async (req, res, next) => {

        try {
            const pessoas = await PessoaModel.find({}).select("nome sobrenome telefone email status");

            res.status(200).json({
                count: pessoas.length,
                pessoas: pessoas.map(pessoa => {
                    return {
                        nome: pessoa.nome,
                        sobrenome: pessoa.sobrenome,
                        telefone: pessoa.telefone,
                        email: pessoa.email,
                        status: pessoa.status,
                        _id: pessoa._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/pessoas/" + pessoa._id
                        }
                    }
                })
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    salvar_pessoa: async (req, res, next) => {
        console.log(req.body);
        try {
            let pessoa = new PessoaModel({});
            pessoa.nome = req.body.nome;
            pessoa.sobrenome = req.body.sobrenome;
            pessoa.telefone = req.body.telefone;
            pessoa.email = req.body.email;
            pessoa.status = req.body.status;

            pessoa = await pessoa.save();

            res.status(201).json({
                message: 'Pessoa salva com sucesso!',
                createdPessoa: {
                    nome: pessoa.nome,
                    _id: pessoa._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/pessoas/" + pessoa._id
                    }
                }
            })
        } catch (err) {
            console.log(err);
            res.status(500).json(err);            
        } 
    },

    excluir_pessoa: async (req, res, next) => {
        const id = req.params.PessoaId;

        try {
            let status = await PessoaModel.deleteOne({_id: id});

            res.status(200).json({
                message: 'Pessoa Deletada!',
                status: status
            })
        } catch (err) {
            console.log(err);
            res.status(500).json(err);            
        }
    },
}