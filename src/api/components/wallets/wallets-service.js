const { available } = require('../../../models/wallets-schema');
const walletsRepository = require('./wallets-repository');

async function getWallets() {
  const wallets = await walletsRepository.getWallets();
  const results = wallets.map((wallet) => ({
    id: wallet.id,
    balance: wallet.balance,
    bank: wallet.bank,
    card: wallet.card,
  }));

  return results;
}

async function getWallet(id) {
  const wallet = await walletsRepository.getWallet(id);
  if (!wallet) {
    return null;
  }
  return {
    id: wallet.id,
    balance: wallet.balance,
    bank: wallet.bank,
    card: wallet.card,
  };
}

async function createWallet(balance, bank, card) {
  try {
    await walletsRepository.createWallet(balance, bank, card);
  } catch (err) {
    return null;
  }

  return true;
}

async function updateWallet(id, balance, bank, card) {
  const wallet = await walletsRepository.getWallet(id);
  if (!wallet) {
    return null;
  }

  try {
    await walletsRepository.updateWallet(id, balance, bank, card);
  } catch (err) {
    return null;
  }

  return true;
}

async function deleteWallet(id) {
  const wallet = await walletsRepository.getWallet(id);
  if (!wallet) {
    return null;
  }

  try {
    await walletsRepository.deleteWallet(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getWallets,
  getWallet,
  createWallet,
  updateWallet,
  deleteWallet,
};
