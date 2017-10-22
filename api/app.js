'use strict'

var express = require('express');
var bodyParser = require('body-parser');


var app = express();



//cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Allow', 'GET, POST, PUT, DELETE');

    next();
})


//rutas base
app.use('/api', [user_routes, artist_routes]);
//app.use(express.static('public'));

app.get('/pruebas', function (req, res) {
    res.status(200).send({message: 'Bienvenido al curso de Mean 2'});
});



module.exports = app;
