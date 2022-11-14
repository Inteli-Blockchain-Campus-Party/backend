const Controller = require('./Controller');
const Connection = require('../Services/ConnectionService');
const APIError = require('../Services/ErrorService');
class UsController {
    static create = (req, res) => Controller.execute(req, res, async (req, res) => {
        const { health_entity_id, user_nft_key_id } = req.body;
        
        if(!health_entity_id) throw new APIError("Health Entity Id is a mandatory field", 400);
        if(!user_nft_key_id) throw new APIError("Health Entity Id is a mandatory field", 400);

        const date = new Date();
        const creation_date = date.getFullYear()  + "-" + date.getMonth()  + "-" + date.getDate()

        const id = await Connection.insert("INSERT INTO hv_user_nft_key_health_entity (user_nft_key_id, health_entity_id, creation_date) VALUES ($user_nft_key_id, $health_entity_id, $creation_date)", {
            user_nft_key_id: user_nft_key_id,
            health_entity_id: health_entity_id,
            creation_date: creation_date
        });

        if(!id) {
            throw new APIError("health_entity_id couldn't be created", 403);
        }

        const userNFTHealthEntityIds = await Connection.get("SELECT * FROM hv_user_nft_key_health_entity WHERE hv_user_nft_key_health_entity.id = $id", {id: id});

        res.json({
            user_nft_key_id: userNFTHealthEntityIds.user_nft_key_id,
            health_entity_id: userNFTHealthEntityIds.health_entity_id,
            creation_date: userNFTHealthEntityIds.creation_date
        })
    });

    static get = (req, res) => Controller.execute(req, res, async (req, res) => {
        const health_entity_id = req.params.healthEntityId;
        const user_nft_key_id = req.params.userNFTKeyId;

        const userNFTHealthEntityId = await Connection.all("SELECT * FROM hv_user_nft_key_health_entity WHERE hv_user_nft_key_health_entity.health_entity_id = $health_entity_id AND hv_user_nft_key_health_entity.user_nft_key_id = $user_nft_key_id", {health_entity_id: health_entity_id, user_nft_key_id: user_nft_key_id});

        res.send({
            user_nft_key_id: userNFTHealthEntityId.user_nft_key_id,
            health_entity_id: userNFTHealthEntityId.health_entity_id,
            creation_date: userNFTHealthEntityId.creation_date
        });
    });

    static allByHealthEntityId = (req, res) => Controller.execute(req, res, async (req, res) => {
        const health_entity_id = req.params.healthEntityId;
        const userId = req.headers.authorization;

        const userNFTHealthEntityId = await Connection.all(`
            SELECT hv_user_nft_key_health_entity.* 
            FROM hv_user_nft_key_health_entity
                INNER JOIN hv_user_nft_key ON hv_user_nft_key.id = hv_user_nft_key_health_entity.user_nft_key.id 
            WHERE hv_user_nft_key_health_entity.health_entity_id = $health_entity_id 
                AND hv_user_nft_key_health_entity.user_nft_key_id = $user_nft_key_id
                AND hv_user_nft_key.user_id = $user_id`, {health_entity_id: health_entity_id, user_id: userId}
        );

        res.send(userNFTHealthEntityId.map(element => {
            return {
                user_nft_key_id: element.user_nft_key_id,
                health_entity_id: element.health_entity_id,
                creation_date: element.creation_date
            }
        }));
    });

    static allByKeyId = (req, res) => Controller.execute(req, res, async (req, res) => {
        const user_nft_key_id = req.params.healthEntityId;

        const userNFTHealthEntityId = await Connection.all(`
            SELECT hv_user_nft_key_health_entity.* 
            FROM hv_user_nft_key_health_entity
            WHERE hv_user_nft_key_health_entity.user_nft_key_id = $user_nft_key_id`, {user_nft_key_id: user_nft_key_id}
        );

        res.send(userNFTHealthEntityId.map(element => {
            return {
                user_nft_key_id: element.user_nft_key_id,
                health_entity_id: element.health_entity_id,
                creation_date: element.creation_date
            }
        }));
    });

    static delete = (req, res) => Controller.execute(req, res, async (req, res) => {
        const health_entity_id = req.params.healthEntityId;
        const user_nft_key_id = req.params.userNFTKeyId;

        await Connection.delete(`DELETE FROM hv_user_nft_key_health_entity WHERE hv_user_nft_key_health_entity.health_entity_id = $health_entity_id AND hv_user_nft_key_health_entity.user_nft_key_id = $user_nft_key_id`, {health_entity_id: health_entity_id, user_nft_key_id: user_nft_key_id});

        res.sendStatus(200);
    });
}

module.exports = UsController
