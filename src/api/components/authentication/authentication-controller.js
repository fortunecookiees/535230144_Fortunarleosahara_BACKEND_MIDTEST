const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

//mekanisme untuk membatasi failed attempt
const failedAttempts = new Map();
const maxAttempts = 5;
const resetAttempts = 30 * 60 * 1000;

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    let userAttempts = failedAttempts.get(email) || {
      attempts: 0,
      lastAttemptTime: 0,
    };
    if (
      userAttempts.attempts >= maxAttempts &&
      Date.now() - userAttempts.lastAttemptTime < resetAttempts
    ) {
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts.'
      );
    }
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );
    if (!loginSuccess) {
      userAttempts.attempts++;
      userAttempts.lastAttemptTime = Date.now();
      failedAttempts.set(email, userAttempts);

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    failedAttempts.delete(email);
    
    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
