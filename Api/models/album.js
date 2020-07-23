'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var albumSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: { type: Schema.ObjectId, ref: 'artist' }
});

module.exports = mongoose.model('album', albumSchema);