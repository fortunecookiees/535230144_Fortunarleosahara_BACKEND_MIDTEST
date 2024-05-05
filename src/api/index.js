const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const wallets = require('./components/wallets/wallets-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  wallets(app);

  return app;
};
