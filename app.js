const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, err => {
        if (err) throw err;
        console.log('connected to MongoDB!!!');
    });

require('./api/models/pessoa');
require('./api/models/endereco');

const app = express();

const pessoaRoutes = require('./api/routes/pessoas');
const enderecoRoutes = require('./api/routes/enderecos');

app.use(morgan('dev')); 
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const cors = (req, res, next) => {
    const whitelist = [
        'http://localhost:8080',
        'http://localhost:4200'
    ];
    const origin = req.headers.origin;
    if (whitelist.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
    next();
}
app.use(cors);

app.use('/pessoas', pessoaRoutes);
app.use('/enderecos', enderecoRoutes);

app.use('/api', (req, res, next) => {
    res.status(200).json({
        message: 'Hello word - trabalho pós!'
    })
})

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;