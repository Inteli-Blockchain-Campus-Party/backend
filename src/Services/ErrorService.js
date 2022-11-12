const LogService = require('./LogService')
class APIError {
    status;
    message;
    description;

    constructor(message, status = 500, description = null){
        this.status = status;
        this.message = message;
        this.description = description;

        LogService.logDanger(`Created Error with \x1b[31m'${status}\x1b[0m' status, ${message ? `and message '\x1b[31m${message}\x1b[0m'` : ''} ${description ? ` and description \x1b[31m'${description}\x1b[0m'` : ''}`)
    }

    getObjectForClient(){
        return {
            "status": this.status,
            "message": this.message
        }
    }
}

module.exports = APIError;