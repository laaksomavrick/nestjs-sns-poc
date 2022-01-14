import { SetMetadata } from "@nestjs/common";
import { QueueMessageHandler } from "./queue-message-handler";

export const SQS_QUEUE_HANDLER = "SQS_QUEUE_HANDLER";

export interface QueueConfig {
    queueUrl: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
}

export interface QueueMetadataConfig extends QueueConfig {
  target: Function;
}

export const Queue = (config: QueueConfig) => {
  return (target: Function) => {
    SetMetadata<string, QueueMetadataConfig>(
      SQS_QUEUE_HANDLER,
      {
        ...config,
        target,
      }
    )(target.prototype)
  };
};