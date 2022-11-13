const Controller = require('./Controller');

class IndexController {
    static get = (req, res) => Controller.execute(req, res, async (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.send({
            "test": "Ok"
        })
    })
}

module.exports = IndexController
