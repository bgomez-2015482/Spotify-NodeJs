'use strict'
var express = require('express');
var artistController = require('../controllers/artist.controller');

var api = express.Router();
var mdAuth = require('../middlewares/authenticated');

api.get('/artist/:id', mdAuth.ensureAuth, artistController.getArtist);
api.post('/artist', mdAuth.ensureAuth, artistController.saveArtist);
api.get('/artists/:page?', mdAuth.ensureAuth, artistController.getArtists);

module.exports = api;