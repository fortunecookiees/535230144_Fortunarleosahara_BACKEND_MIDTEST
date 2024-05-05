const { Wallet } = require('../../../models');

async function getWallets() {
  return Wallet.find({});
}

async function getWallet(id) {
  return Wallet.findById(id);
}

async function createWallet(balance, bank, card) {
  return Wallet.create({
    balance,
    bank,
    card,
  });
}

async function updateWallet(id, balance, bank, card) {
  return Wallet.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        balance,
        bank,
        card,
      },
    }
  );
}

async function deleteWallet(id) {
  return Wallet.deleteOne({ _id: id });
}

module.exports = {
  getWallets,
  getWallet,
  createWallet,
  updateWallet,
  deleteWallet,
};
