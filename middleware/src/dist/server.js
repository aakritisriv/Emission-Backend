"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
require("reflect-metadata");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config_1 = require("./config");
const typedi_1 = require("typedi");
const constants_1 = require("./constants");
const edge_sdk_service_1 = require("./services/edge-sdk.service");
const Data_Custom_service_1 = require("./services/Data-Custom.service");
class Server {
    constructor() {
        this.app = express();
        if (this.app.get('env') === 'development') {
            this.app.use(cors({ origin: [config_1.corsClientHost], credentials: true }));
        }
        this.createMiddlewares();
    }
    setHttpServerToken(httpServer) {
        /**
         * Add http server to Inversion-of-Control's (IoC) container.
         * Will need it later for websocket client.
         *
         * Side note: in this DEMO middleware IoC is implemented using 3rd-party npm package "typedi"
         */
        typedi_1.Container.set(constants_1.HTTP_SERVER_TOKEN, httpServer);
    }
    createsubscriptionRouter() {
        const edgeSdk = typedi_1.Container.get(edge_sdk_service_1.EWEdgeSdkService);
        this.app.use('/api/v1/subscription', edgeSdk._subscriptionRouter.router); //localhost:3000/api/v1/subscription/
    }
    handleDatacoustomover() {
        const dataService = typedi_1.Container.get(Data_Custom_service_1.DataCustomService);
        dataService.handleCrossover();
    }
    createMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}
exports.Server = Server;
exports.default = new Server();
//# sourceMappingURL=server.js.map