'use strict'
var express = require('express');
var userController = require('../controllers/user.controller');

var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var mdUpload = multipart({ uploadDir: './uploads/users' });

api.get('/probando-controlador', mdAuth.ensureAuth, userController.pruebas);
api.post('/register', userController.saveUser);
api.post('/login', userController.loginUser);
api.put('/update-user/:id', mdAuth.ensureAuth, userController.updateUser);
api.post('/upload-image-user/:id', [mdAuth.ensureAuth, mdUpload], userController.uploadImage);
api.get('/get-image-user/:imageFile', userController.getImageFile);

module.exports = api;