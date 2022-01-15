import { Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import {
  QueueConfig,
  SQS_QUEUE_HANDLER,
  SQS_QUEUE_ON_ERROR,
  SQS_QUEUE_ON_MESSAGE,
} from '.';

export interface SqsMessageHandler {
  config: QueueConfig;
  onMessage: (message: AWS.SQS.Message) => Promise<void>;
  onError: (err: Error) => Promise<void>;
}

@Injectable()
export class SqsExplorer {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  /**
   * Find all classes marked with @Queue and their associated @OnMessage and @OnError handlers
   */
  public explore(): SqsMessageHandler[] {
    const providers = this.discoveryService.getProviders();

    const queueMessageHandlers = providers
      .filter(this.isQueueClass)
      .map((wrapper) => {
        const queue = wrapper.instance;
        const prototype = Object.getPrototypeOf(queue);
        const config = this.getQueueConfig(prototype);
        const onMessage = this.getOnMessage(queue, prototype);
        const onError = this.getOnError(queue, prototype);

        return {
          config,
          onMessage,
          onError,
        };
      });

    return queueMessageHandlers;
  }

  private getQueueConfig = (prototype) => {
    const config = Reflect.getMetadata(SQS_QUEUE_HANDLER, prototype);

    if (config == null) {
      throw new Error(
        `Queue configuration missing for the queue: ${prototype.constructor.name} - did you supply arguments to the @Queue decorator?`,
      );
    }

    return config;
  };

  private getOnMessage = (queue, prototype) => {
    const onMessages = this.metadataScanner.scanFromPrototype(
      queue,
      prototype,
      (method) => {
        const targetCallback = queue[method];
        const handler = Reflect.getMetadata(
          SQS_QUEUE_ON_MESSAGE,
          targetCallback,
        );
        if (handler == null) {
          return null;
        }
        return handler;
      },
    );

    if (onMessages == null || onMessages.length === 0) {
      throw new Error(
        `OnMessage missing for the queue: ${queue.constructor.name} - does this class have an @OnMessage?`,
      );
    }

    if (onMessages.length > 1) {
      throw new Error(
        `Only one OnMessage allowed for the queue: ${queue.constructor.name}.`,
      );
    }

    return onMessages[0].callback;
  };

  private getOnError = (queue, prototype) => {
    const onErrors = this.metadataScanner.scanFromPrototype(
      queue,
      prototype,
      (method) => {
        const targetCallback = queue[method];
        const handler = Reflect.getMetadata(SQS_QUEUE_ON_ERROR, targetCallback);
        if (handler == null) {
          return null;
        }
        return handler;
      },
    );

    if (onErrors == null || onErrors.length === 0) {
      throw new Error(
        `OnError missing for the queue: ${queue.constructor.name} - does this class have an @OnError?`,
      );
    }

    if (onErrors.length > 1) {
      throw new Error(
        `Only one OnError allowed for the queue: ${queue.constructor.name}.`,
      );
    }

    return onErrors[0].callback;
  };

  private isQueueClass = (wrapper: InstanceWrapper<any>): boolean => {
    const instance = wrapper.instance;

    if (instance == null) {
      return false;
    }

    const prototype = Object.getPrototypeOf(instance);
    const config = Reflect.getMetadata(SQS_QUEUE_HANDLER, prototype);

    if (config == null) {
      return false;
    }

    return true;
  };
}
