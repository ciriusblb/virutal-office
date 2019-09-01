const express = require('express');

const loginController = require('../controllers/login.controller');
const authManagerMiddleware = require('../middlewares/auth.manager.middleware');

const loginRouter = express.Router();


loginRouter.route('/')
  .post([authManagerMiddleware.getUserByEmail,authManagerMiddleware.getUser],loginController.createCustomToken);

loginRouter.route('/renuevaToken')
  .get([authManagerMiddleware.verifyIdToken],loginController.renewCustomToken);

module.exports = loginRouter;