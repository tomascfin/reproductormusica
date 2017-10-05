'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../servicios/jwt');

function pruebas(req, res) {
    res.status(200).send({message: 'Probando una accion del controlador de usuarios del api rest con node y mongo'});
};

function saveUser(req, res) {
    var user = new User();

    var params = req.body;
    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';

    if (params.password) {
        bcrypt.hash(params.password, null, null, function (err, hash) {

            user.password = hash;
            console.log(hash);
            if (user.name != null && user.surname != null && user.email != null) {
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({message: 'Error al guardar el usuario'});
                    } else {
                        if (!userStored) {
                            res.status(404).send({message: 'Error al guardar el usuario'});
                        } else {
                            res.status(200).send({user : userStored, message: 'Usuario ingresado'});
                        }
                    }
                })
            } else {
                res.status(200).send({message: 'Introduzca todos los campos'});
            }
        });
    } else {
        res.status(500).send({message: 'Introduzca contraseña'});
    }

};

function login(req, res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        console.log(typeof emailgit ad);
        if(err){
            res.status(500).send({message: 'Error e la peticion'});
        }else{
            if(!user){
                res.status(404).send({message: 'El usuario no existe'});
            }else{
                //comprobar password
                bcrypt.compare(password, user.password, (errr, check) => {
                    if(check){
                        //devolver los datos del usuario logueado
                        if(params.gethash){
                            res.status(200).send({
                               token: jwt.createToken(user)
                            });

                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message: 'Usuario no ha podido loguearse'});
                    }

                })
            }
        }
    })
}

module.exports = {
    pruebas,
    saveUser,
    login
};