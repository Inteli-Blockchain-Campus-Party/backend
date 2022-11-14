const Middleware = require('./Middleware');

const AuthService = require('../Services/AuthService');
const { JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');
const APIError = require('../Services/ErrorService');

class AuthMiddleware extends Middleware {
    static verifyUserToken = (req, res, next) => Middleware.execute(req, res, next, async (req, res) => {
        try{
            return AuthService.verifyToken(req.headers.authorization, true, 1);
        } catch (error) {
            if (error instanceof JsonWebTokenError){
                throw new APIError("Invalid Token", 400);
            } else if (error instanceof TokenExpiredError){
                throw new APIError("Expired Token", 400);
            } else {
                throw error
            }
        }
    })

    static verifyHealthEntityToken = (req, res, next) => Middleware.execute(req, res, next, async (req, res) => {
        try {
            return AuthService.verifyToken(req.headers.authorization, true, 2);
        } catch (error) {
            if (error instanceof JsonWebTokenError){
                throw new APIError("Invalid Token", 400);
            } else if (error instanceof TokenExpiredError){
                throw new APIError("Expired Token", 400);
            } else {
                throw error
            }
        }
    })
}

module.exports = AuthMiddleware;