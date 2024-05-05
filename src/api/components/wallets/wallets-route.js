const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const walletsControllers = require('./wallets-controller');
const walletsValidator = require('./wallets-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/wallets', route);

  route.get('/', authenticationMiddleware, walletsControllers.getWallets);

  route.post(
    '/',
    authenticationMiddleware,
    celebrate(walletsValidator.createWallet),
    walletsControllers.createWallet
  );

  route.get('/:id', authenticationMiddleware, walletsControllers.getWallet);

  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(walletsValidator.updateWallet),
    walletsControllers.updateWallet
  );

  route.delete(
    '/:id',
    authenticationMiddleware,
    walletsControllers.deleteWallet
  );
};
