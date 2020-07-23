'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Routes
var userRoutes = require('./routes/user.route');
var artistRoutes = require('./routes/artist.route');
var albumRoutes = require('./routes/album.route');
var songRoutes = require('./routes/song.route');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Cabeceras http

app.use((req, res, next) => {
    res.header('Acces-Control-Allow-Origin', '*');
    res.header('Acces-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Acces-Control-Allow-Methods', 'GET', 'POST', 'OPTIONS', 'PUT', 'DELETE');
    res.header('Allow', 'GET', 'POST', 'OPTIONS', 'PUT', 'DELETE');

    next();
});

//Router base
app.use('/api', userRoutes);
app.use('/api', artistRoutes);
app.use('/api', albumRoutes);
app.use('/api', songRoutes);

module.exports = app;