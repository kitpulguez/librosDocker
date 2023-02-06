/*
Ejercicio de desarrollo de servicios con Express. Sobre la base de datos de "libros" de  
sesiones anteriores, se desarrollarán los servicios básicos paras operaciones habituales de
GET, POST, PUT y DELETE. En este caso, dejamos hechas las operaciones tipo GET.

En esta versión del ejercicio, se estructura el código en carpetas separadas para modelos
y enrutadores
*/

// Carga de librerías
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const nunjucks = require("nunjucks");
const methodOverride = require("method-override");

// CREACION DE USUARIOS

const usuarios = [
    { usuario: 'nacho', password: '12345' },
    { usuario: 'pepe', password: 'pepe111' }
];

// Enrutadores
const libros = require(__dirname + '/routes/libros');
const autores = require(__dirname + '/routes/autores');  // Para la parte opcional

// Conectar con BD en Mongo 
mongoose.connect('mongodb://localhost:27017/libros');
    
// Inicializar Express
let app = express();
app.use('/public', express.static(__dirname + '/public'));  

// Definicion de sesiones en Express
app.use(session({
    secret: "1234",
    resave: true,
    saveUninitialized: false
}));
 

// Cargar middleware body-parser para peticiones POST y PUT
// y enrutadores
app.set("view engine", "njk");
app.use(express.json());
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.urlencoded());

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
   

app.use('/libros', libros);
app.use('/autores', autores); // Para la parte opcional

app.get("/login", (req, res) => {
    res.render("login");
});

app.post('/login', (req, res) => {
    let login = req.body.login;
    let password = req.body.password;
    let existeUsuario = usuarios.filter(usuario => usuario.usuario == login && usuario.password == password);

    if (existeUsuario.length > 0)
    {
        req.session.usuario = existeUsuario[0].usuario;
        res.render('index');
    } else {
        res.render('login',{error: "Usuario o contraseña incorrectos"});
    }
});

nunjucks.configure("views", {
    autoescape: true,
    express: app
});

// Puesta en marcha del servidor
app.listen(8080);