const express = require('express');

const afiliadoController = require('../controllers/afiliado.controller');
const authManagerMiddleware = require('../middlewares/auth.manager.middleware');

const afiliadoRoute = express.Router();


afiliadoRoute.route('/')
    .post([authManagerMiddleware.verifyIdToken,authManagerMiddleware.createUser],afiliadoController.pendingAccounts);

afiliadoRoute.route('/:DNI')
    .get([authManagerMiddleware.verifyIdToken],afiliadoController.getAffiliates);

module.exports = afiliadoRoute;