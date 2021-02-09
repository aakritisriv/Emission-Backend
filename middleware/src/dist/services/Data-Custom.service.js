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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataCustomService = void 0;
const typedi_1 = require("typedi");
const edge_sdk_service_1 = require("./edge-sdk.service");
const oil_burner_service_1 = require("./oil-burner.service");
let DataCustomService = class DataCustomService {
    constructor(edgeSdk, oilBurnerInfoService) {
        this.edgeSdk = edgeSdk;
        this.oilBurnerInfoService = oilBurnerInfoService;
        this.crossoverProcessor = (edgeData) => {
            const crossoveredVariablesMap = new Map();
            for (const variable of edgeData.variables) {
                const value = edgeData.getVariableInRow(0, variable);
                let counterpartValue;
                const counterpartVariable = this.getVariableCounterpart(variable);
                if (counterpartVariable === undefined) {
                    continue;
                }
                const counterpartVariablePos = edgeData.getVariablePosition(counterpartVariable);
                if (counterpartVariablePos !== undefined) {
                    counterpartValue = edgeData.getVariableInRow(0, counterpartVariable);
                }
                else {
                    /**
                     
                     * we would be able to query cached variables
                     */
                    const cachedVariable = this.edgeSdk._dataProcessor.getCachedVariable(counterpartVariable);
                    counterpartValue = cachedVariable === null || cachedVariable === void 0 ? void 0 : cachedVariable.value;
                }
                if (counterpartValue === undefined) {
                    continue;
                }
                if (value > counterpartValue) {
                    crossoveredVariablesMap.set(variable, counterpartVariable);
                }
            }
            if (crossoveredVariablesMap.size === 0) {
                return;
            }
            /*
             * we would be able to query registered subscribers
             */
            const subscriptions = this.edgeSdk._subscriptionManager.getSubscriptions();
            for (const [variable, counterpartVariable] of crossoveredVariablesMap) {
                const filteredSubscriptions = subscriptions.filter(sub => {
                    return sub.variables.includes(variable) && sub.variables.includes(counterpartVariable);
                });
                const message = `"${variable}" is more than "${counterpartVariable}"`;
                for (const filteredSubscription of filteredSubscriptions) {
                    /**
                     * Via websockets, show Oil burner for every variable,
                     * that passed the condition "variableB > variableA"
                     */
                    this.oilBurnerInfoService.displayOilBurner(filteredSubscription.uniqueName, variable, message);
                }
            }
        };
        this.getVariableCounterpart = (variableName) => {
            const label = variableName.slice(0, -1);
            const type = variableName.slice(-1);
            if (type !== 'B') {
                return;
            }
            return `${label}A`;
        };
    }
    handleCrossover() {
        /**
         *  send data via websockets if condition is passed
         */
        this.edgeSdk._dataProcessor.useEdgeDataProcessor(this.crossoverProcessor);
    }
};
DataCustomService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [edge_sdk_service_1.EWEdgeSdkService, oil_burner_service_1.OilBurnerService])
], DataCustomService);
exports.DataCustomService = DataCustomService;
//# sourceMappingURL=Data-Custom.service.js.map