import { RabbitMqService } from './rabbitmq.service';
import { config } from '../config';

export class DataService {
    constructor(private _rabbitMqService: RabbitMqService) { }

    public getforEmissionwidgetData() {
        this._rabbitMqService._isConnected$.subscribe(() => {
            this._rabbitMqService.subscribeToMessages(config.rabbitSubscriberSettings, this.onMessage);
            this._rabbitMqService.setupChannelForPublishingMessages(config.rabbitPublisherSettings, config.rabbitPublisherSettings.channel
            );
            console.log('[DataService]: Subscribed and setup channel for publishing');
        });
    }

    private publishData(message): void {
        const channel = config.rabbitPublisherSettings.channel;

        console.log(`[DataService]: Publishing message to channel ${channel}`);
        this._rabbitMqService.sendData(channel, message);
    }
    private onMessage = (message): void => {
        console.log('[DataService]: Received message:');
        console.log(message);
        this.publishData(message);
    }
}