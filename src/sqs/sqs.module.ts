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
    const queueHandlers = this.explorer.explore();

    for (const queueHandler of queueHandlers) {
      const handler = queueHandler.handler;
      const config = queueHandler.config;
      const consumer = sqsConsumerFactory(handler, config);
      consumer.start();
    }
  }
}
