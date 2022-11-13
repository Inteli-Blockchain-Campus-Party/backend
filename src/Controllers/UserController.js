const Controller = require('./Controller');
const crypto = require('crypto');
const dotenv = require('dotenv').config()

const jsonwebtoken = require('jsonwebtoken')

const Connection = require('../Services/ConnectionService');
const APIError = require('../Services/ErrorService');

class UserController {
    static create = (req, res) => Controller.execute(req, res, async (req, res) => {
        const { password, wallet, cpf } = req.body;
        
        if(!password) res.status(400).send("Password is a mandatory field");
        if(!wallet) res.status(400).send("Wallet is a mandatory field");
        if(!cpf) res.status(400).send("Cpf is a mandatory field");

        const password_salt = crypto.randomBytes(10).toString("hex");
        const password_hash = crypto.pbkdf2Sync(password, password_salt, 1000, 64, 'sha1').toString('hex');

        const date = new Date();
        const creation_date = date.getFullYear()  + "-" + date.getMonth()  + "-" + date.getDay()
        const update_date = null;

        const id = await Connection.insert("INSERT INTO hv_user (password_hash, password_salt, wallet, cpf, creation_date, update_date) VALUES ($password_hash, $password_salt, $wallet, $cpf, $creation_date, $update_date)", {
            password_hash: password_hash,
            password_salt: password_salt,
            wallet: wallet,
            cpf: cpf,
            creation_date: creation_date,
            update_date: update_date
        });

        const token = jsonwebtoken.sign({id: id}, process.env.SECRET_KEY, {
            expiresIn: '5h'
        })

        res.json({token: token})
    });

    static login = (req, res) => Controller.execute(req, res, async (req, res) => {
        const { login, password } = req.body;

        if(!login) res.status(400).send("Login is a mandatory field");
        if(!password) res.status(400).send("Password is a mandatory field");

        const user = await Connection.get("SELECT * FROM hv_user WHERE wallet= $login OR cpf = $login", {
            login: login
        });

        if(!user){
            throw new APIError("User not found", 404);
        }

        if(crypto.pbkdf2Sync(password, user.password_salt, 1000, 64, 'sha1').toString('hex') == user.password_hash){
            res.send({
                token: jsonwebtoken.sign({id: user.id}, process.env.SECRET_KEY, {
                    expiresIn: '5h'
                })
            })
        }else {
            res.status(403).send({
                message: "Wrong Credentials"
            })
        }
    })

    static get = (req, res) => Controller.execute(req, res, async (req, res) => {
        const token = jsonwebtoken.decode(req.headers.authorization);

        if(!req.headers.authorization || !token.id) return res.send('Token is a mandatory header field');

        const user = await Connection.get("SELECT * FROM hv_user WHERE hv_user.id = $id", {id: token.id});

        res.send({
            id: user.id,
            wallet: user.wallet,
            cpf: user.cpf
        });
    });

    static update = (req, res) => Controller.execute(req, res, async (req, res) => {
        const token = jsonwebtoken.decode(req.headers.authorization);

        if(!req.headers.authorization || !token.id) return res.send('Token is a mandatory header field');

        const {wallet, cpf} = req.body;

        let updateObject = {wallet: wallet, cpf: cpf};
        let cleanUpdateEntrie = Object.entries(updateObject).filter(element => element[1]);
    
        Object.entries(updateObject).forEach(element => {
            if(!element[1]){
                delete updateObject[element[0]];
            }
        });

        console.log(cleanUpdateEntrie)

        if(cleanUpdateEntrie.length){
            const date = new Date();
            const update_date = date.getFullYear()  + "-" + date.getMonth()  + "-" + date.getDay();
            updateObject.update_date = update_date;

            await Connection.update(`UPDATE hv_user SET ${Object.keys(updateObject).map(key => `${key} = $${key}`).join(", ")} WHERE id = $id`, {...updateObject, id: token.id})
        }
        
        const user = await Connection.get("SELECT * FROM hv_user WHERE hv_user.id = $id", {id: token.id});

        res.send({
            id: user.id,
            wallet: user.wallet,
            cpf: user.cpf
        });
    });

    static delete = (req, res) => Controller.execute(req, res, async (req, res) => {
        const token = jsonwebtoken.decode(req.headers.authorization);

        if(!req.headers.authorization || !token.id) return res.send('Token is a mandatory header field');

        await Connection.delete(`DELETE FROM hv_user WHERE hv_user.id = $id`, {id: token.id});

        res.sendStatus(200);
    });
}

module.exports = UserController