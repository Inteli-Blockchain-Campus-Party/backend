const Controller = require('./Controller');

class IndexController {
    static get = (req, res) => Controller.execute(req, res, async (req, res) => {
        res.sendStatus(200)
    })
}

module.exports = IndexController
