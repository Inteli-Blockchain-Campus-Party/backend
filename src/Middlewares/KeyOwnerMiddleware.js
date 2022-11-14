const Middleware = require('./Middleware');

const AuthService = require('../Services/AuthService');
const ConnectionService = require('../Services/ConnectionService');
const APIError = require('../Services/ErrorService');

class KeyOwnerMiddleware extends Middleware {
    static verifyKeyOwner = (req, res, next) => Middleware.execute(req, res, next, async (req, res) => {
        const userId = AuthService.getIdByToken(req.headers.authorization);
        const keyId = req.params.id || req.params.userNFTKeyId;

        const key = await ConnectionService.get("SELECT * FROM hv_user_nft_key WHERE hv_user_nft_key.user_id = $user_id AND hv_user_nft_key.id = $key_id", {user_id: userId, key_id: keyId})

        if(!key){
            throw new APIError("Key doesn't exist", 403);
        }
    })

    static verifyKeyHealthEntityOwner = (req, res, next) => Middleware.execute(req, res, next, async (req, res) => {
        const userId = AuthService.getIdByToken(req.headers.authorization);
        const keyId = req.params.userNFTKeyId;
        const healthEntityId = req.params.healthEntityId;

        const key = await ConnectionService.get(`
        SELECT hv_user_nft_key_health_entity.* 
        FROM hv_user_nft_key_health_entity
            INNER JOIN hv_user_nft_key ON hv_user_nft_key.id = hv_user_nft_key_health_entity.user_nft_key.id 
        WHERE hv_user_nft_key_health_entity.health_entity_id = $health_entity_id 
            AND hv_user_nft_key_health_entity.user_nft_key_id = $user_nft_key_id
            AND hv_user_nft_key.user_id = $user_id
        `
        , {user_id: userId, key_id: keyId, health_entity_id: healthEntityId, key_id: keyId})

        if(!key){
            throw new APIError("Key doesn't exist", 403);
        }
    })
}

module.exports = KeyOwnerMiddleware;