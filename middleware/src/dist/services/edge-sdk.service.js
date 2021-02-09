"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EWEdgeSdkService = void 0;
const edge_sdk_1 = require("@hds/edge-sdk");
const typedi_1 = require("typedi");
const config_1 = require("../config");
const constants_1 = require("../constants");
let EWEdgeSdkService = class EWEdgeSdkService {
    constructor(httpServer) {
        this.httpServer = httpServer;
        edge_sdk_1.LogService.initialize('config.json');
        const sdk = new edge_sdk_1.EdgeSDK();
        console.log(sdk);
        // console.log(sdk.serviceProvider);
        //  console.log(this.httpServer);
        sdk.serviceProvider.initWebSocket(this.httpServer);
        sdk.initCommonMiddleware({
            rabbitMqConfig: {
                subscriberConfig: [config_1.rabbitMqConfig.settings],
                publisherConfig: config_1.rabbitMqConfig.settings
            },
            webSocketPublish: true,
            useDbCaching: true
        });
        sdk.iotManagement.start().then(() => {
            edge_sdk_1.LogService.log(edge_sdk_1.LOG_LEVEL.SYSTEM_INFO, "IoT modules created and running.");
        }).catch((err) => {
            edge_sdk_1.LogService.log(edge_sdk_1.LOG_LEVEL.ERROR, err);
        });
        this._webSocket = sdk.serviceProvider.webSocket;
        this._dataProcessor = sdk.commonMiddleware.dataProcessor;
        this._subscriptionManager = sdk.commonMiddleware.dataSubscriptionManager;
        this._subscriptionRouter = sdk.commonMiddleware.subscriptionRouter;
    }
};
EWEdgeSdkService = __decorate([
    typedi_1.Service({ global: true }),
    __param(0, typedi_1.Inject(constants_1.HTTP_SERVER_TOKEN)),
    __metadata("design:paramtypes", [Object])
], EWEdgeSdkService);
exports.EWEdgeSdkService = EWEdgeSdkService;
//# sourceMappingURL=edge-sdk.service.js.map