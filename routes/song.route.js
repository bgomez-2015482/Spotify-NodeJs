'use strict'
var express = require('express');

var api = express.Router();
var mdAuth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var songController = require('../controllers/song.controller');
var mdUpload = multipart({ uploadDir: './uploads/songs' });

api.get('/song/:id', mdAuth.ensureAuth, songController.getSong);
api.post('/saveSong', mdAuth.ensureAuth, songController.saveSong);
api.get('/songs/:album?', mdAuth.ensureAuth, songController.getSongs);
api.put('/update-song/:id', mdAuth.ensureAuth, songController.updateSong);
api.delete('/delete-song/:id', mdAuth.ensureAuth, songController.deleteSong);
api.post('/upload-song/:id', [mdAuth.ensureAuth, mdUpload], songController.uploadSong);
api.get('/get-song/:songFile', songController.getSongFile);

module.exports = api;