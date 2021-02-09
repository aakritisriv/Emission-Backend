import { EdgeSDK, LogService, LOG_LEVEL } from '@hds/edge-sdk';
import { Inject, Service, Token } from 'typedi';

import { rabbitMqConfig } from '../config';
//import { IRmqClientService } from '@hds/edge-sdk/services/common/rabbit-mq.client';
//import { IRabbitMQSetting } from '@hds/edge-sdk/models/common/rabbit-mq.config.model';
import { IWebSocketService } from '@hds/edge-sdk/services/common/web-socket.service';
import { IDataProcessor } from '@hds/edge-sdk/services/middleware/data-processor.service';
import { IDataSubscriptionManager } from '@hds/edge-sdk/services/middleware/data-subscription-manager';
import { CommonMiddlewareDataSubscriptionRouter } from '@hds/edge-sdk/routes/api-v1/common-middleware-data-subscription.router';
import { HTTP_SERVER_TOKEN } from '../constants';
import { exception } from 'console';

@Service({ global: true })

export class EWEdgeSdkService {
    public _webSocket: IWebSocketService;
    public _dataProcessor: IDataProcessor;
    public _subscriptionManager: IDataSubscriptionManager;
    public _subscriptionRouter: CommonMiddlewareDataSubscriptionRouter;
    constructor(@Inject(HTTP_SERVER_TOKEN) private httpServer) {
        LogService.initialize('config.json');
       
        const sdk = new EdgeSDK();
      
        console.log(sdk);
       // console.log(sdk.serviceProvider);
    //  console.log(this.httpServer);
        sdk.serviceProvider.initWebSocket(this.httpServer);
        
        
        sdk.initCommonMiddleware({
            rabbitMqConfig: {
                subscriberConfig: [rabbitMqConfig.settings],
                publisherConfig: rabbitMqConfig.settings
            },
            webSocketPublish: true,
            useDbCaching: true
        });
        sdk.iotManagement.start().then(()=>{
            LogService.log(LOG_LEVEL.SYSTEM_INFO,"IoT modules created and running.")
        }).catch((err)=>{
            LogService.log(LOG_LEVEL.ERROR,err);
        })
        this._webSocket = sdk.serviceProvider.webSocket;
        this._dataProcessor = sdk.commonMiddleware.dataProcessor;
        this._subscriptionManager = sdk.commonMiddleware.dataSubscriptionManager;
        this._subscriptionRouter = sdk.commonMiddleware.subscriptionRouter;
    }


}