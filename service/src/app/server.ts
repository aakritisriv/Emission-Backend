import * as express from 'express';
import * as bodyParser from 'body-parser';
import { RabbitMqService } from './services/rabbitmq.service';
import { config } from './config';
import { DataService } from './services/data.service';

export class Server {

  public app: express.Application;

  constructor() {
    this.app = express();

    this.setMiddlewares();
    this.initDependencies();
  }

  private setMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private initDependencies() {
    const rabbitMqService = new RabbitMqService(config.rabbitConnection);
    const dataService = new DataService(rabbitMqService);
    dataService.getforEmissionwidgetData();
  }
}

export default new Server();
