import { Injectable, InjectableOptions, SetMetadata } from '@nestjs/common';

export const SQS_QUEUE_HANDLER = 'SQS_QUEUE_HANDLER';
export const SQS_QUEUE_ON_MESSAGE = 'SQS_QUEUE_ON_MESSAGE';
export const SQS_QUEUE_ON_ERROR = 'SQS_QUEUE_ON_ERROR';

export const Queue = (
  queueOptions: QueueConfig,
  injectableOptions?: InjectableOptions,
) => {
  return (target: Function) => {
    QueueConfig(queueOptions)(target);
    Injectable(injectableOptions)(target);
  };
};

export interface QueueConfig {
  queueUrl: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface QueueConfigMetadataConfig extends QueueConfig {
  target: Function;
}

export const QueueConfig = (config: QueueConfig) => {
  return (target: Function) => {
    SetMetadata<string, QueueConfigMetadataConfig>(SQS_QUEUE_HANDLER, {
      ...config,
      target,
    })(target.prototype);
  };
};

export interface QueueOnMessageMetadataConfig {
  methodName: string;
  target: string;
  callback(msg: AWS.SQS.Message): Promise<void>;
}

export const OnMessage = () => {
  return (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    SetMetadata<string, QueueOnMessageMetadataConfig>(SQS_QUEUE_ON_MESSAGE, {
      target: target.constructor.name,
      methodName: propertyKey,
      callback: descriptor.value,
    })(target, propertyKey, descriptor);
  };
};

export interface QueueOnErrorMetadataConfig {
  methodName: string;
  target: string;
  callback(err: Error): Promise<void>;
}

export const OnError = () => {
  return (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    SetMetadata<string, QueueOnErrorMetadataConfig>(SQS_QUEUE_ON_ERROR, {
      target: target.constructor.name,
      methodName: propertyKey,
      callback: descriptor.value,
    })(target, propertyKey, descriptor);
  };
};
