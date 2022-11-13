const APIError = require('../Services/ErrorService');
const LogService = require('../Services/LogService');

class Controller {
    static async execute(req, res, callback) {
        try {
            const date = new Date();
            LogService.log(`Acessed ${req.method} ${req.url} at ${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`)
            
            return await callback(req, res);
        } catch (error) {
            if(error instanceof APIError){
                LogService.logDanger(`API Error ${JSON.stringify(error)}`);
                res.status(error.status);
                res.json(error.getObjectForClient());
            } else {
                console.log(error);
                res.status(500);
                res.json({
                    status: 500,
                    message: 'Um erro interno ocorreu'
                })
            }
        }
    }
}

module.exports = Controller;