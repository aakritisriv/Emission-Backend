import * as RabbitMqConnection from '@hds/rabbitmq-connection';
import { ReplaySubject } from 'rxjs';
import { IRabbitMQSetting } from '../interfaces/rabbitmq-setting.interface';

export class RabbitMqService {
  private _rabbitMQ: RabbitMqConnection;
  public _isConnected$: ReplaySubject<boolean> = new ReplaySubject();
  constructor(conString: string) {
    this._rabbitMQ = new RabbitMqConnection(conString);
    this._rabbitMQ.setOnAmqpConnectedCallback((conn) => {
      console.log('[RabbitMqService]:RabbitMQ connected');
      this._isConnected$.next(true);
    });

    this._rabbitMQ.connect();
  }

  public subscribeToMessages(subscriptionInfo: IRabbitMQSetting, callback: (msg: any) => void): void {
    this._rabbitMQ.subscribeToMessages(this._rabbitMQ.amqpConnection, subscriptionInfo, callback);
  }
  public setupChannelForPublishingMessages(publishingInfo: IRabbitMQSetting, channelName: string): void {
    this._rabbitMQ.setupChannelForPublishingMessages(this._rabbitMQ.amqpConnection, publishingInfo, channelName);
  }
  public sendData(channelName: string, data: any, routingKey?: string): void {
    this._rabbitMQ.sendData(channelName, data, routingKey);
  }
}
