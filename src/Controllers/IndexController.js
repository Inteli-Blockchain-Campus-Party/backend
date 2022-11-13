const Controller = require('./Controller');

class IndexController {
    static get = (req, res) => Controller.execute(req, res, async (req, res) => {
        res.send({
            "test": "Ok"
        })
    })
}

module.exports = IndexController
