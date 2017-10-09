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
                            res.status(200).send({user: userStored, message: 'Usuario ingresado'});
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

function login(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        console.log(email.toLocaleLowerCase());
        if (err) {
            res.status(500).send({message: 'Error e la peticion'});
        } else {
            if (!user) {
                res.status(404).send({message: 'El usuario no existe'});
            } else {
                //comprobar password
                bcrypt.compare(password, user.password, (errr, check) => {
                    if (check) {
                        //devolver los datos del usuario logueado
                        if (params.gethash) {
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });

                        } else {
                            res.status(200).send({user});
                        }
                    } else {
                        res.status(404).send({message: 'Usuario no ha podido loguearse'});
                    }

                })
            }
        }
    })
};

function updateUser(req, res) {

    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, function (error, userUpdated) {
        if (error) {
            res.status(500).send({message: 'Error al actualizar usuario'});
        } else {
            if (!userUpdated) {
                res.status(404).send({message: 'Usuario no ha podido actualizarse'});
            } else {
                res.status(200).send({user: userUpdated, message: 'Usuario actualizado'});
            }
        }
    })
};

function uploadImage(req, res) {

    var userId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        file_name = file_split[2];

        var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];

            if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif')
            {
                User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) =>{
                if (err) {
                    res.status(500).send({message: 'Error al actualizar usuario'});
                } else {
                    if (!userUpdated) {
                        res.status(404).send({message: 'Usuario no ha podido actualizarse'});
                    } else {
                        res.status(200).send({user: userUpdated, message: 'Usuario actualizado'});
                    }
                }
            });

            }else{
                res.status(200).send({user: userUpdated, message: 'Extension del archivo no correcta'});
            }
        console.log(file_path);
        console.log(file_split);
        console.log(file_ext);
    } else {
        res.status(200).send({user: userUpdated, message: 'No ha subido ninguna imagen'});
    }
};

module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    uploadImage
};