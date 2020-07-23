'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
const song = require('../models/song');
const { exists } = require('../models/artist');

function getSong(req, res) {
    var songId = req.params.id;
    //populate para sacar la iformacion no solo de la cancion sino asociarle en la propiedad album todos los datos de album al cual esta asociado
    Song.findById(songId).populate({
        path: 'album' //sacar el objeto completo del id del objeto guardado
    }).exec((err, song) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la petición'
            });
        } else {
            if (!song) {
                res.status(404).send({
                    message: 'La canción no existe'
                });
            } else {
                res.status(200).send({
                    song
                });
            }
        }
    });
}

function getSongs(req, res) {
    var albumId = req.params.album;
    if (!albumId) {
        var find = Song.find({}).sort('number');
    } else {
        var find = Song.find({ album: albumId }).sort('number');
    }
    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'artist'
        }
    }).exec((err, songs) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la petición'
            });
        } else {
            if (!songs) {
                res.status(404).send({
                    message: 'El album no existe'
                });
            } else {
                res.status(200).send({
                    songs
                });
            }
        }
    });
}

function saveSong(req, res) {
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored) => {
        if (err) {
            res.status(500).send({
                message: 'Error en el servidor'
            });
        } else {
            if (!songStored) {
                res.status(404).send({
                    message: 'No se ha guardado la canción'
                });
            } else {
                res.status(200).send({
                    song: songStored
                });
            }
        }
    });

}

function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'Error en el servidor'
            });
        } else {
            if (!songUpdated) {
                res.status(404).send({
                    message: 'No se ha actualizado la canción'
                });
            } else {
                res.status(200).send({
                    song: songUpdated
                });
            }
        }
    });

}

function deleteSong(req, res) {
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if (err) {
            res.status(500).send({
                message: 'Error al eliminar la canción'
            });
        } else {
            if (!songRemoved) {
                res.status(404).send({
                    message: 'La canción no se ha eliminado'
                });
            } else {
                res.status(200).send({
                    song: songRemoved
                });
            }
        }
    });
}

function uploadSong(req, res) {
    var songId = req.params.id;
    var file_name = 'Error al cargar la imagen';

    if (req.files) {
        var file_path = req.files.song.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'mp3' || file_ext == 'ogg') {
            Song.findByIdAndUpdate(songId, { file: file_name }, (err, songUpdated) => {
                if (!songUpdated) {
                    res.status(404).send({
                        message: 'No se ha podido actualizar la canción'
                    });
                } else {
                    res.status(200).send({
                        song: songUpdated
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
            message: 'No has subido ninguna canción'
        });
    }
}

function getSongFile(req, res) {
    var songFile = req.params.songFile;
    var path_file = './uploads/songs/' + songFile;

    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({
                message: 'No existe la canción'
            });
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadSong,
    getSongFile

}