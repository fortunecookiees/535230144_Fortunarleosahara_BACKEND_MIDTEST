const walletsService = require('./wallets-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function getWallets(request, response, next) {
  try {
    const wallets = await walletsService.getWallets();
    return response.status(200).json(wallets);
  } catch (error) {
    return next(error);
  }
}

async function getWallet(request, response, next) {
  try {
    const wallet = await walletsService.getWallet(request.params.id);

    if (!wallet) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown wallet');
    }

    return response.status(200).json(wallet);
  } catch (error) {
    return next(error);
  }
}

async function createWallet(request, response, next) {
  try {
    const { balance, bank, card } = request.body;

    const success = await walletsService.createWallet(balance, bank, card);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create wallet'
      );
    }

    return response.status(200).json({ balance, bank, card });
  } catch (error) {
    return next(error);
  }
}

async function updateWallet(request, response, next) {
  try {
    const id = request.params.id;
    const { balance, bank, card } = request.body;

    const success = await walletsService.updateWallet(id, balance, bank, card);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update wallet'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

async function deleteWallet(request, response, next) {
  try {
    const id = request.params.id;
    const success = await walletsService.deleteWallet(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete wallet'
      );
    }

    return response.status(200).json({
      message: 'Successfully removed wallet',
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getWallets,
  getWallet,
  createWallet,
  updateWallet,
  deleteWallet,
};
