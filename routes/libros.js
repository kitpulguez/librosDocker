const express = require('express');

const multer = require("multer");

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/portadas')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)
    }
});

let upload = multer({storage: storage});

let Libro = require(__dirname + '/../models/libro.js');
let router = express.Router();

let autentification = (req, res, next) => {
    if (req.session && req.session.usuario)
        return next();
    else
        res.render("login");
};
   

// Servicio de listado general
router.get("/", autentification, (req, res) => {
    Libro.find().then(resultado => {
        res.render("libros_listado", {libros: resultado});
    }).catch(error => {

    });
});

router.get("/nuevo", autentification, (req, res) => {
    res.render("libros_nuevos");
});



// Servicio de listado por id
router.get('/:id', (req, res) => {
    Libro.findById(req.params.id).then(resultado => {
        if(resultado)
            res.render("libros_ficha", {libro: resultado});
    }).catch (error => {
        res.render("error");
    }); 
});

// Servicio para insertar libros
router.post('/', upload.single('imagen') ,(req, res) => {
    let nuevoLibro = new Libro({
        titulo: req.body.titulo,
        editorial: req.body.editorial,
        precio: req.body.precio,
        portada: req.file.filename
    });
    
    nuevoLibro.save().then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render("error", {error: "Error añadiendo libro"});
    });
});

// Servicio para modificar libros
router.put('/:id', (req, res) => {

    Libro.findByIdAndUpdate(req.params.id, {
        $set: {
            titulo: req.body.titulo,
            editorial: req.body.editorial,
            precio: req.body.precio,
            portada: req.file.filename
        }
    }, {new: true}).then(resultado => {
        if (resultado)
            res.redirect(req.baseUrl);
        else
            res.render("error", {error: "No se ha encontrado el libro"});
    }).catch(error => {
        res.render("error", {error: "Error editando libro"});
    });
});

// Servicio para borrar libros
router.delete('/:id', (req, res) => {

    Libro.findByIdAndRemove(req.params.id).then(resultado => {
        res.redirect(req.baseUrl);
    }).catch(error => {
        res.render('error', {error: "Error borrando contacto"});
    });
});

module.exports = router;