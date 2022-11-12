class LogService {
    // Cria um log de sucesso no sistema
    static logSuccess(...string){
        console.log(`\x1b[32m[SUCCESS]\x1b[0m ${string.map(string => typeof string == 'object' ? JSON.stringify(string) : String(string)).join("\n")}`);
    }

    // Cria um log de warning no sistema
    static logWarning(...string){
        console.log(`\x1b[33m[WARNING]\x1b[0m ${string.map(string => typeof string == 'object' ? JSON.stringify(string) : String(string)).join("\n")}`);
    }

    // Cria um log de danger no sistema
    static logDanger(...string){
        console.log(`\x1b[31m[DANGER]\x1b[0m ${string.map(string => typeof string == 'object' ? JSON.stringify(string) : String(string)).join("\n")}`);
    }

    static log(...string) {
        console.log(`${string.map(string => typeof string == 'object' ? JSON.stringify(string) : String(string)).join("\n")}`);
    }
}

module.exports = LogService;