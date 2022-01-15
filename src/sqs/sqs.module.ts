import { Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { sqsConsumerFactory } from './sqs-consumer.factory';
import { SqsExplorer } from './sqs.explorer';

@Module({
  imports: [],
  providers: [DiscoveryService, SqsExplorer, MetadataScanner],
  exports: [],
})
export class SqsModule implements OnModuleInit {
  constructor(private readonly explorer: SqsExplorer) {}

  async onModuleInit() {
    const queues = this.explorer.explore();

    for (const queue of queues) {
      const config = queue.config;
      const onMessage = queue.onMessage;
      const onError = queue.onError;
      const consumer = sqsConsumerFactory(config, onMessage, onError);
      consumer.start();
    }
  }
}
