import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { corsClientHost, serviceConfig } from './config';
import { Container } from 'typedi';
import { HTTP_SERVER_TOKEN } from './constants';
import { createProxyMiddleware } from 'http-proxy-middleware';
import LogService from '@hds/edge-sdk';
import { EWEdgeSdkService } from './services/edge-sdk.service';
import { Server as HttpServer } from 'http';
import { DataCustomService } from './services/Data-Custom.service';
export class Server {
    public app: express.Application;
    
    constructor() {
        this.app = express();
        if (this.app.get('env') === 'development') {
            this.app.use(cors({ origin: [corsClientHost], credentials: true }));
        }

        this.createMiddlewares();
    }
    public setHttpServerToken(httpServer: HttpServer): void {
        /**
         * Add http server to Inversion-of-Control's (IoC) container.
         * Will need it later for websocket client.
         *
         * Side note: in this DEMO middleware IoC is implemented using 3rd-party npm package "typedi"
         */
        Container.set(HTTP_SERVER_TOKEN, httpServer);
      }
    
    public createsubscriptionRouter() {

        
        const edgeSdk = Container.get(EWEdgeSdkService);

        this.app.use('/api/v1/subscription', edgeSdk._subscriptionRouter.router); //localhost:3000/api/v1/subscription/


    }
    public handleDatacoustomover(): void {
        const dataService = Container.get(DataCustomService);
        dataService.handleCrossover();
      }
    public createMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

}
export default new Server();