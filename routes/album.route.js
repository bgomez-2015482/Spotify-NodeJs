'use strict'
var express = require('express');
var albumController = require('../controllers/album.controller');

var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var mdUpload = multipart({ uploadDir: './uploads/albums' });

api.get('/album/:id', mdAuth.ensureAuth, albumController.getAlbum);
api.post('/saveAlbum', mdAuth.ensureAuth, albumController.saveAlbum);
api.get('/albums/:artist?', mdAuth.ensureAuth, albumController.getAlbums);
api.put('/update-album/:id', mdAuth.ensureAuth, albumController.updateAlbum);
api.delete('/album-delete/:id', mdAuth.ensureAuth, albumController.deleteAlbum);
api.post('/upload-image-album/:id', [mdAuth.ensureAuth, mdUpload], albumController.uploadImage);
api.get('/get-image-album/:imageFile', albumController.getImageFile);

module.exports = api;