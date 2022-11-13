const Middleware = require('./Middleware');

const AuthService = require('../Services/AuthService');

class AuthMiddleware extends Middleware {
    static verifyUserToken = (req, res, next) => Middleware.execute(req, res, next, async (req, res) => {
        return AuthService.verifyToken(req.headers.authorization);
    })
}

module.exports = AuthMiddleware;