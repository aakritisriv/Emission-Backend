import { Service } from 'typedi';
import { EWEdgeSdkService } from './edge-sdk.service';
import { IEdgeWidget } from '../interfaces/ewWidgets.interface';
import { v4 as uuid } from 'uuid';

@Service()
export class OilBurnerService {
    public static readonly messageName = 'Oil-Burnner';
    constructor(private edgeSdk: EWEdgeSdkService) {
    }
    public displayOilBurner(namespace: string, variableName: string, description: string): void {
        const oilBurnerInfo = this.bulidOilBurner(variableName, description);

        this.edgeSdk._webSocket.broadcastToNamespace(namespace, OilBurnerService.messageName, oilBurnerInfo);
    }
    private bulidOilBurner(variableName: string, description: string): IEdgeWidget {
        return {
            _id: uuid(),
            title: variableName,
            variableName,
            description,
            type: null,
            sourceId: null,
            expirationType: null,
            start: null,
            end: null,
            finalDestination: null,
            approvalRequired: null,
            priority: null
        };
    }
}