'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artistSchema = Schema({
    name: String,
    description: String,
    image: String
});

module.exports = mongoose.model('artist', artistSchema);