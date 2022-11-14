const Controller = require('./Controller');
const crypto = require('crypto');
const Connection = require('../Services/ConnectionService');
const APIError = require('../Services/ErrorService');
const AuthService = require('../Services/AuthService');
const CriptoService = require('../Services/CriptoService');

class UserNFTKeyController {
    static create = (req, res) => Controller.execute(req, res, async (req, res) => {
        const { key, level, info } = req.body;

        const user_id = AuthService.getIdByToken(req.headers.authorization);

        const user = await Connection.get("SELECT * FROM hv_user WHERE hv_user.id = $id", {id: user_id});
        
        if(!key) res.status(400).send("key is a mandatory field");
        if(typeof level == 'undefined') res.status(400).send("level is a mandatory field");

        // Enviar o objeto info (Doenças, tudo que o usuário quer criptografar na NFT com a KEY que ele passou).
            // Criptografar com a key -> info + level
        // const keyHash = crypto.pbkdf2Sync(key, '', 1000, 64, 'sha1').toString('hex');
        const encryptedInfo = CriptoService.encrypt(info, key);
        const formatedMetadata = CriptoService.formatNFTMetadata(encryptedInfo, level);
        const tokenInfo = await CriptoService.upload(formatedMetadata);
        await CriptoService.mintNFT(user.wallet, tokenInfo.IpfsHash)

        const date = new Date();
        const creation_date = date.getFullYear()  + "-" + date.getMonth()  + "-" + date.getDate()

        const id = await Connection.insert("INSERT INTO hv_user_nft_key (user_id, key, level, creation_date) VALUES ($user_id, $key, $level, $creation_date)", {
            user_id: user_id,
            key: key,
            level: level,
            creation_date: creation_date
        });

        if(!id) {
            throw new APIError("Key couldn't be created", 403);
        }

        const userNFTKey = await Connection.get("SELECT * FROM hv_user_nft_key WHERE hv_user_nft_key.id = $id", {id: id});

        res.json({
            id: userNFTKey.id,
            key: userNFTKey.key,
            level: userNFTKey.level
        })
    });

    static get = (req, res) => Controller.execute(req, res, async (req, res) => {
        const id = req.params.id;
        const withNFTInfo = req.query.withNFT;

        const userNFTKey = await Connection.get("SELECT hv_user_nft_key.*, hv_user.wallet AS wallet_user FROM hv_user_nft_key INNER JOIN hv_user ON hv_user.id = hv_user_nft_key.user_id WHERE hv_user_nft_key.id = $id", {id: id});

        if(!userNFTKey){
            throw new APIError("Key not found", 400);
        }

        let info = undefined;
        if(withNFTInfo){
            info = {};
            const nft = await CriptoService.getNFT(userNFTKey.wallet_user, userNFTKey.key);
            if(nft){
                const infoNft = CriptoService.getDecriptedDataFromNFT(nft);
                info = infoNft
            }
        }

        res.send({
            id: userNFTKey.id,
            key: userNFTKey.key,
            level: userNFTKey.level,
            info
        });
    });

    static all = (req, res) => Controller.execute(req, res, async (req, res) => {
        const userId = AuthService.getIdByToken(req.headers.authorization);
        const withNFTInfo = req.query.withNFT;

        const userNFTKeys = await Connection.all("SELECT hv_user_nft_key.*, hv_user.wallet AS wallet_user FROM hv_user_nft_key INNER JOIN hv_user ON hv_user.id = hv_user_nft_key.user_id WHERE hv_user_nft_key.user_id = $user_id", {user_id: userId});

        res.send(await Promise.all(userNFTKeys.map(async element => {

            let info = undefined;

            if(withNFTInfo){
                info = {};
                const nft = await CriptoService.getNFT(element.wallet_user, element.key);
                if(nft){
                    const infoNft = CriptoService.getDecriptedDataFromNFT(nft);
                    info = infoNft
                }
            }

            return {
                id: element.id,
                key: element.key,
                level: element.level,
                info: info
            }
        })));
    });

    static getNFTByKey = (req, res) => Controller.execute(req, res, async (req, res) => {
        const keyId = req.params.key;

        const userNFTKey = await Connection.get(`
            SELECT hv_user_nft_key.*, 
                hv_user.wallet AS wallet_user 
            FROM hv_user_nft_key 
                INNER JOIN hv_user ON hv_user.id = hv_user_nft_key.user_id 
            WHERE hv_user_nft_key.id = $id`, {id: keyId});

        const nft = await CriptoService.getNFT(userNFTKey.wallet_user, userNFTKey.key);
        const info = CriptoService.getDecriptedDataFromNFT(nft, userNFTKey.key);
    
        res.json(info);
    }) 

    static delete = (req, res) => Controller.execute(req, res, async (req, res) => {
        const id = req.params.id;

        await Connection.delete(`DELETE FROM hv_user_nft_key WHERE hv_user_nft_key.id = $id`, {id: id});

        res.sendStatus(200);
    });
}

module.exports = UserNFTKeyController
