const mongoose = require('mongoose');
const EnderecoModel = mongoose.model('Endereco');
const PessoaModel = mongoose.model('Pessoa');

module.exports = {
    get_all_enderecos: async(req, res, next) => {
        try {
        
            const enderecos = await EnderecoModel.find({}).select("pessoa_id, cep, logradouro, numero, complemento, bairro, cidade, uf")
        
            res.status(200).json({
                count: enderecos.length,
                enderecos: enderecos.map(order => {
                    return {
                        pessoa_id: enderecos.pessoa_id,
                        cep: enderecos.cep,
                        logradouro: enderecos.logradouro,
                        numero: enderecos.numero,
                        complemento: enderecos.complemento,
                        bairro: enderecos.bairro,
                        cidade: enderecos.cidade,
                        uf: enderecos.uf,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/enderecos/" + enderecos._id
                        }
                    }
                })
            });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    get_info_endereco: async (req, res, next) => {
        try {
            let endereco = await EnderecoModel.findById(req.enderecoId);

            if (endereco) {
                res.status(200).json(endereco);
            } else {
                res.status(404).json("Endereço não existe!");
            }

        } catch (err) {
            console.log(err);
            res.status(500).json(err);            
        }
    },

    salvar_endereco: async (req, res, next) => {
        console.log(req.body);
    
        try {
            if (!req.body.pessoa_id) {
                res.status(404).json({message: "Pessoa não existe"});
                return;
            }
    
            let pessoa = null;
            try {
                pessoa = await PessoaModel.findOne({_id: req.body.pessoa_id});
                if (!pessoa) {
                    res.status(404).json({message: "Pessoa não existe!"});
                    return;
                }
            } catch (error) {
                console.log(err);
                res.status(500).json(err);
            }
    
            if (pessoa) {
                let endereco = new EnderecoModel({
                    pessoa_id: req.body.pessoaId,
                    cep: req.body.cep,
                    logradouro: req.body.logradouro,
                    numero: req.body.numero,
                    complemento: req.body.complemento,
                    bairro: req.body.bairro,
                    cidade: req.body.cidade,
                    uf: req.body.uf
                });
    
                endereco = await endereco.save();
    
                res.status(201).json({
                    message: 'Endereço criado com sucesso!',
                    createdEndereco: {
                        pessoa_id: endereco.pessoa_id,
                        cep: endereco.cep,
                        logradouro: endereco.logradouro,
                        numero: endereco.numero,
                        complemento: endereco.complemento,
                        bairro: endereco.bairro,
                        cidade: endereco.cidade,
                        uf: endereco.uf,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/enderecos/" + endereco._id
                        }
                    }
                })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    excluir_endereco: async (req, res, next) => {
        const id = req.params.enderecoId;

        try {
            let status = await EnderecoModel.deleteOne({_id: id});

            res.status(200).json({
                message: 'Endereço excluído com sucesso!',
                status: status
            })
        } catch (err) {
            console.log(err);
            res.status(500).json(err);    
        }
    },

}