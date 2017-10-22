'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

var http = require('http');
var server = http.createServer(app);

var io = require('socket.io')(server);
//const http = require('http');

//sockett

//server.listen(app.get(port));



mongoose.connect('mongodb://localhost:27017/curso_mean2', (err, res) => {
//mongoose.connect('mongodb://tomas:123456@ds161304.mlab.com:61304/curso_mean2', (err, res) => {
    if (err) {
        throw err;
    } else {

        console.log('Conexion exitosa');
        server.listen(port, function () {
            console.log('Servidor  del api rest esta corriendo');

        });
    }
});


io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    //test messages
    socket.on('event1', (data)=>{
        console.log(data.msg);
    });

    socket.emit('event2', {
        msg: 'Server to client, me lees? Over.'
    });

    socket.on('event3', (data)=>{
        console.log(data.msg);
        socket.emit('event4', {
            msg: 'Loud and clear:)'
        });
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    })
})
