'use strict'

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function pruebas(req, res) {
    res.status(200).send({
        message: 'Token valido, Bienvenido'
    });
}

function saveUser(req, res) {
    var user = new User();
    var params = req.body;

    if (params.name &&
        params.username &&
        params.email &&
        params.password) {
        User.findOne({
            $or: [{
                username: params.username
            }, {
                email: params.email
            }]
        }, (err, userFind) => {
            if (err) {
                res.status(500).send({
                    message: 'Error general, intentelo más tarde'
                });
            } else if (userFind) {
                res.send({
                    message: 'Usuario o correo ya utilizado'
                });
            } else {
                user.name = params.name;
                user.username = params.username;
                user.email = params.email;
                user.role = 'ADMIN';
                user.image = 'NULL';

                bcrypt.hash(params.password, null, null, (err, passwordHash) => {
                    if (err) {
                        res.status(500).send({
                            message: 'Error al encriptar la contraseña'
                        });
                    } else if (passwordHash) {
                        user.password = passwordHash;
                        user.save((err, userSaved) => {
                            if (err) {
                                res.status(500).send({
                                    message: 'Error general al guardar el usuario'
                                });
                            } else if (userSaved) {
                                res.send({
                                    user: userSaved
                                });
                            } else {
                                res.status(404).send({
                                    message: 'Usuario no guardado'
                                });
                            }
                        });
                    } else {
                        res.status(418).send({
                            message: 'Error inesperado'
                        });
                    }
                });
            }
        });
    } else {
        res.send({
            message: 'Ingresa todos los datos'
        });
    }
}

function loginUser(req, res) {
    var params = req.body;

    if (params.username || params.email) {
        if (params.password) {
            User.findOne({
                $or: [{ username: params.username },
                    { email: params.email }
                ]
            }, (err, check) => {
                if (err) {
                    res.status(500).send({ message: 'Error general' });
                } else if (check) {
                    bcrypt.compare(params.password, check.password, (err, passworOk) => {
                        if (err) {
                            res.status(500).send({ message: 'Error al comparar' });
                        } else if (passworOk) {
                            if (params.gettoken == 'true') {
                                res.send({ token: jwt.createToken(check), user: check.name });
                            } else {
                                res.send({ message: 'Error en el servidor al generar autenticación' });
                            }
                        } else {
                            res.send({ message: 'Contraseña incorrecta' });
                        }
                    });
                } else {
                    res.send({ message: 'Datos de usuario incorrectos' });
                }
            });
        } else {
            res.send({ message: 'Ingresa tu contraseña' });
        }
    } else {
        res.send({ message: 'Ingresa tu correo o tu username' });
    }
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    if (userId != req.user.sub) {
        res.status(403).send({
            message: 'Error de permisos, usuario no logueado'
        });
    } else {
        User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
            if (err) {
                res.status(500).send({
                    message: 'Error general al actualizar'
                });
            } else if (userUpdated) {
                res.send({ user: userUpdated });
            } else {
                res.status(404).send({
                    message: 'No se ha podido actualizar'
                });
            }
        });
    }
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'Error al cargar la imagen';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
                if (!userUpdated) {
                    res.status(404).send({
                        message: 'No se ha podido actualizar el usuario'
                    });
                } else {
                    res.status(200).send({
                        user: userUpdated
                    });
                }
            });
        } else {
            res.status(500).send({
                message: 'Extensión del archivo no valida'
            });
        }

    } else {
        res.status(500).send({
            message: 'No has subido ninguna imagen'
        });
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({
                message: 'No existe la imagen'
            });
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};