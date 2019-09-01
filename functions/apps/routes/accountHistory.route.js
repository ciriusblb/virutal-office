const express = require('express');

const accountHistoryController = require('../controllers/accountHistory.controller');
const authManagerMiddleware = require('../middlewares/auth.manager.middleware');

const accountHistory = express.Router();


accountHistory.route('/:DNI')
  .get([authManagerMiddleware.verifyIdToken],accountHistoryController.accountHistoryUser);

accountHistory.route('/:DNI')
  .put([authManagerMiddleware.verifyIdToken],accountHistoryController.putPaymentHistory);

accountHistory.route('/get/:DNI')
  .get([authManagerMiddleware.verifyIdToken],accountHistoryController.getPaymentHistory);

module.exports = accountHistory;