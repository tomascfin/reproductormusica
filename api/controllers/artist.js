'use strict';

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res) {
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if (err) {
            res.status(500).send({message: 'Error en la peticion'});
        } else {
            if (!artist) {
                res.status(404).send({message: 'El artista no existe'});
            } else {
                res.status(200).send({artist});
            }
        }
    });


};

function getArtists(req, res) {
    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }

    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, function (err, artists, total) {
        if (err) {
            res.status(500).send({message: 'Error en la peticion'});
        } else {
            if (!artists) {
                res.status(404).send({message: 'No hay artistas'});
            } else {
                return res.status(200).send({
                    total_items: total,
                    artist: artists
                });
            }
        }
    });
};

function saveArtist(req, res) {
    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({message: 'Error al guardar el artista'});
        } else {
            if (!artistStored) {
                res.status(404).send({message: 'El artista no ha sido guardado'});
            } else {
                res.status(200).send({artist: artistStored});
            }
        }
    })
};

function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, function (err, artistRemoved) {
        if (err) {
            res.status(500).send({message: 'Error al eliminar el artista'});
        } else {
            if (!artistRemoved) {
                res.status(404).send({message: 'El artista no ha sido eliminado'});
            } else {
                console.log(artistRemoved);
                res.status(200).send({artist: artistRemoved});
                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
                    if (err) {
                        res.status(500).send({message: 'Error al eliminar el album'});
                    } else {
                        if (!albumRemoved) {
                            res.status(404).send({message: 'El album no ha sido eliminado'});
                        } else {
                            console.log(albumRemoved);
                            res.status(200).send({artist: albumRemoved});

                            Song.find({artist: albumRemoved._id}).remove((err, songRemoved) => {
                                if (err) {
                                    res.status(500).send({message: 'Error al eliminar la cancion'});
                                } else {
                                    if (!songRemoved) {
                                        res.status(404).send({message: 'La cancion no ha sido eliminada'});
                                    } else {
                                        console.log(songRemoved);
                                        res.status(200).send({artist: songRemoved});
                                    }
                                }
                            })
                        }
                    }
                });
            }
        }
    })
}

function uploadImage(req, res){
    var artistId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif')
        {
            Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) =>{
                if (err) {
                    res.status(500).send({message: 'Error al actualizar artista'});
                } else {
                    if (!artistUpdated) {
                        res.status(404).send({message: 'Artista no ha podido actualizarse'});
                    } else {
                        res.status(200).send({user: artistUpdated, message: 'Artista actualizado'});
                    }
                }
            });

        }else{
            res.status(200).send({user: artistUpdated, message: 'Extension del archivo no correcta'});
        }
        console.log(file_path);
        console.log(file_split);
        console.log(file_ext);
    } else {
        res.status(200).send({user: artistUpdated, message: 'No ha subido ninguna imagen'});
    }
}

function getImageFile(req, res) {
    var imagenFile = req.params.imageFile;
    var path_file = './uploads/artists/' +imagenFile;
    fs.exists(path_file, function (exits) {
        if(exits){
            res.sendFile(path.resolve(path_file));

        }else{
            res.status(200).send({message: 'Imagen no existe'});
        }
    })
};


function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) {
            res.status(500).send({message: 'Error al actualizar el artista'});
        } else {
            if (!artistUpdated) {
                res.status(404).send({message: 'El artista no ha sido actualizado'});
            } else {
                res.status(200).send({artist: artistUpdated});


            }
        }
    })
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};
