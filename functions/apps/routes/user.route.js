const express = require('express');

const userController = require('../controllers/user.controller');
const authManagerMiddleware = require('../middlewares/auth.manager.middleware');

const userRoute = express.Router();


userRoute.route('/')
  .post([authManagerMiddleware.getUserByEmail,
    authManagerMiddleware.verifySponsorAndHashSync,
    authManagerMiddleware.setUsersAccounts,
    authManagerMiddleware.updateUser],userController.saveUser);

userRoute.route('/:id')
  .put([authManagerMiddleware.verifyIdToken,
  authManagerMiddleware.getDoc,
  authManagerMiddleware.updateUser],
  userController.editUser);

userRoute.route('/levels')
    .get(userController.getLevels);

userRoute.route('/user/:id')
    .get(userController.getUser);

module.exports = userRoute;