"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const server_1 = require("./server");
const config_1 = require("./config");
const port = normalizePort(process.env.PORT || config_1.serviceConfig.port);
const httpServer = http.createServer(server_1.default.app);
httpServer.listen(port);
httpServer.on('error', onError);
httpServer.on('listening', onListening);
server_1.default.setHttpServerToken(httpServer);
server_1.default.createsubscriptionRouter();
server_1.default.handleDatacoustomover();
function normalizePort(val) {
    const port = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) {
        return val;
    }
    else if (port >= 0) {
        return port;
    }
    else {
        return false;
    }
}
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    const addr = httpServer.address();
    const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
}
//# sourceMappingURL=index.js.map