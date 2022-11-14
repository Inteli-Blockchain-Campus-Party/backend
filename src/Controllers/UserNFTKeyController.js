const Controller = require('./Controller');
const crypto = require('crypto');
const Connection = require('../Services/ConnectionService');
const APIError = require('../Services/ErrorService');
const AuthService = require('../Services/AuthService');

class UserNFTKeyController {
    static create = (req, res) => Controller.execute(req, res, async (req, res) => {
        const { key, level } = req.body;

        const user_id = AuthService.getIdByToken(req.headers.authorization);
        
        if(!key) res.status(400).send("key is a mandatory field");
        if(typeof level == 'undefined') res.status(400).send("level is a mandatory field");

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

        const userNFTKey = await Connection.get("SELECT * FROM hv_user_nft_key WHERE hv_user_nft_key.id = $id", {id: id});

        if(!userNFTKey){
            throw new APIError("Key not found", 400);
        }

        res.send({
            id: userNFTKey.id,
            key: userNFTKey.key,
            level: userNFTKey.level
        });
    });

    static all = (req, res) => Controller.execute(req, res, async (req, res) => {
        const userId = AuthService.getIdByToken(req.headers.authorization);

        const userNFTKeys = await Connection.all("SELECT * FROM hv_user_nft_key WHERE hv_user_nft_key.user_id = $user_id", {user_id: userId});

        res.send(userNFTKeys.map(element => {
            return {
                id: element.id,
                key: element.key,
                level: element.level
            }
        }));
    });

    static delete = (req, res) => Controller.execute(req, res, async (req, res) => {
        const id = req.params.id;

        await Connection.delete(`DELETE FROM hv_user_nft_key WHERE hv_user_nft_key.id = $id`, {id: id});

        res.sendStatus(200);
    });
}

module.exports = UserNFTKeyController
