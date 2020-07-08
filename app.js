'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Routes
var userRoutes = require('./routes/user.route');
var artistRoutes = require('./routes/artist.route');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Cabeceras http

//Router base
app.use('/api', userRoutes);
app.use('/api', artistRoutes);

module.exports = app;