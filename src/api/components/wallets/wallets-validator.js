const joi = require('joi');

module.exports = {
  createWallet: {
    body: {
      balance: joi.number().required().label('Balance'),
      bank: joi.string().min(1).max(100).required().label('Bank'),
      card: joi.string().valid('debit', 'credit').required().label('Card'),
    },
  },

  updateWallet: {
    body: {
      balance: joi.number().required().label('Balance'),
      bank: joi.string().min(1).max(100).required().label('Bank'),
      card: joi.string().valid('debit', 'credit').required().label('Card'),
    },
  },
};
