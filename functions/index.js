require('zone.js/dist/zone-node');

const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const { enableProdMode } = require('@angular/core');
const { renderModuleFactory }= require('@angular/platform-server');
const cors = require('cors');

const { AppServerModuleNgFactory } = require('./dist/server/main');
// const firebase = require('firebase-admin');

enableProdMode();

const index = require('fs')
    .readFileSync(path.resolve(__dirname, './dist/browser/index.html'), 'utf8')
    .toString();

// const firebaseApp = firebase.initializeApp(
//     functions.config().firebase
// );

let main = express();
let app = express();

app.use('/ssr', main);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors({ origin: true }));
app.use(cors());

app.get('**', function(req,res){
    renderModuleFactory(AppServerModuleNgFactory, {
        url: req.path,
        document: index
    }).then( html => res.status(200).send(html));
});

exports.ssr = functions.https.onRequest(app);

//importar rutas
var appRoutes = require('./apps/routes/app');
var usuarioRoutes = require('./apps/routes/user.route');
var afiliadoRoutes = require('./apps/routes/afiliado.route');
var accountHistory = require('./apps/routes/accountHistory.route');
var loginRoutes = require('./apps/routes/login.route');
// Routes
main.use('/usuario',usuarioRoutes);
main.use('/afiliado',afiliadoRoutes);
main.use('/accountHistory',accountHistory);
main.use('/login',loginRoutes);

main.use('/',appRoutes);


// // View all contacts
// main.get('/contacts', (req, res) => {
//     res.status(200).send([{id:1, nombre: 'ciro'}, {id:2, nombre: 'ciro'}, {id:3, nombre: 'ciro'}]);
// })
