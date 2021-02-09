export interface IRabbitMQSetting {
    exchange: string;
    exchangeType: string;
    queueExclusive: boolean;
    routingKey: string;
    durable: boolean;
  }
  