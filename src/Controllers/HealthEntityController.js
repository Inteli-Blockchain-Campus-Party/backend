const Controller = require('./Controller');
const crypto = require('crypto');
const Connection = require('../Services/ConnectionService');
const APIError = require('../Services/ErrorService');
const AuthService = require('../Services/AuthService');

class HealthEntityController {
    static create = (req, res) => Controller.execute(req, res, async (req, res) => {
        const { password, cnpj, email, name, uf} = req.body;
        
        if(!password) throw new APIError("Password is a mandatory field", 400);
        if(!cnpj) throw new APIError("Cnpj is a mandatory field", 400);
        if(!email) throw new APIError("Email is a mandatory field", 400);
        if(!name) throw new APIError("Name is a mandatory field", 400);
        if(!uf) throw new APIError("uf is a mandatory field", 400);

        const password_salt = crypto.randomBytes(10).toString("hex");
        const password_hash = crypto.pbkdf2Sync(password, password_salt, 1000, 64, 'sha1').toString('hex');

        const date = new Date();
        const creation_date = date.getFullYear()  + "-" + date.getMonth()  + "-" + date.getDate()
        const update_date = null;

        const id = await Connection.insert("INSERT INTO hv_health_entity (password_hash, password_salt, name, uf, cnpj, email, creation_date, update_date) VALUES ($password_hash, $password_salt, $name, $uf, $cnpj, $email, $creation_date, $update_date)", {
            password_hash: password_hash,
            password_salt: password_salt,
            name: name,
            uf: uf,
            cnpj: cnpj,
            email: email,
            creation_date: creation_date,
            update_date: update_date
        });

        const token = AuthService.makeTokenWithId(id);

        res.json({token: token})
    });

    static login = (req, res) => Controller.execute(req, res, async (req, res) => {
        const { login, password } = req.body;

        if(!login) throw new APIError("Login is a mandatory field", 400);
        if(!password) throw new APIError("Password is a mandatory field", 400);

        const healthEntity = await Connection.get("SELECT * FROM hv_health_entity WHERE cnpj= $login OR email = $login", {
            login: login
        });

        if(!healthEntity){
            throw new APIError("healthEntity not found", 404);
        }

        if(crypto.pbkdf2Sync(password, healthEntity.password_salt, 1000, 64, 'sha1').toString('hex') == healthEntity.password_hash){
            res.send({
                token: AuthService.makeTokenWithId(healthEntity.id)
            })
        }else {
            res.status(403).send({
                message: "Wrong Credentials"
            })
        }
    })

    static get = (req, res) => Controller.execute(req, res, async (req, res) => {
        const id = AuthService.getIdByToken(req.headers.authorization);

        const healthEntity = await Connection.get("SELECT * FROM hv_health_entity WHERE hv_health_entity.id = $id", {id: id});

        if(!healthEntity){
            throw new APIError("Health Entity not found", 400);
        }

        res.send({
            id: healthEntity.id,
            name: healthEntity.name,
            uf: healthEntity.uf,
            cnpj: healthEntity.cnpj,
            email: healthEntity.email
        });
    });

    static update = (req, res) => Controller.execute(req, res, async (req, res) => {
        const id = AuthService.getIdByToken(req.headers.authorization);

        const {cnpj, email, name, uf} = req.body;

        let updateObject = {cnpj: cnpj, email: email, name: name, uf: uf};
        let cleanUpdateEntrie = Object.entries(updateObject).filter(element => element[1]);
    
        Object.entries(updateObject).forEach(element => {
            if(!element[1]){
                delete updateObject[element[0]];
            }
        });

        if(cleanUpdateEntrie.length){
            const date = new Date();
            const update_date = date.getFullYear()  + "-" + date.getMonth()  + "-" + date.getDate();
            updateObject.update_date = update_date;

            await Connection.update(`UPDATE hv_health_entity SET ${Object.keys(updateObject).map(key => `${key} = $${key}`).join(", ")} WHERE id = $id`, {...updateObject, id: id})
        }
        
        const healthEntity = await Connection.get("SELECT * FROM hv_health_entity WHERE hv_health_entity.id = $id", {id: id});

        res.send({
            id: healthEntity.id,
            cnpj: healthEntity.cnpj,
            email: healthEntity.email,
            name: healthEntity.name,
            uf: healthEntity.uf,
        });
    });

    static delete = (req, res) => Controller.execute(req, res, async (req, res) => {
        const id = AuthService.getIdByToken(req.headers.authorization);

        await Connection.delete(`DELETE FROM hv_health_entity WHERE hv_health_entity.id = $id`, {id: id});

        res.sendStatus(200);
    });
}

module.exports = HealthEntityController
