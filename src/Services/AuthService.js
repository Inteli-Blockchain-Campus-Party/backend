const dotenv = require('dotenv').config({path: __dirname + '/../../.env'})

const { TokenExpiredError } = require('jsonwebtoken');
const jsonwebtoken = require('jsonwebtoken');
const APIError = require('./ErrorService');

class AuthService {
    static getJWTbyAuthorization = (token) => {
        return token.includes(" ") ? token.split(" ")[1] : token;
    }

    static decodeToken = (token) => {
        const jwt = this.getJWTbyAuthorization(token);

        return jsonwebtoken.decode(jwt);
    }

    static verifyToken = (token, mustHaveId = true) => {
        if(!token) throw new APIError('Token is a mandatory header field', 400);

        const jwt = this.getJWTbyAuthorization(token)
        
        try {
            jsonwebtoken.verify(jwt, process.env.SECRET_KEY);

            if(mustHaveId){
                const decodedToken = this.decodeToken(token);
                if(!decodedToken.id){
                    throw new APIError("Token must have an Id", 400);
                }
            }

            return true;
        } catch (error) {
            if(error instanceof TokenExpiredError){
                throw new APIError("Token expirado", 400);
            }else {
                throw error;
            }
        }
    }

    static getIdByToken = (token) => {
        const decodedToken = this.decodeToken(token);

        return decodedToken.id;
    }

    static makeTokenWithId = (id, expires = '5h') => {
        console.log(process.env.SECRET_KEY)
        return jsonwebtoken.sign({id: id}, process.env.SECRET_KEY, {
            expiresIn: expires || '5h'
        })
    }
}

module.exports = AuthService;