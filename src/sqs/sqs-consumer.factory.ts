import * as AWS from 'aws-sdk';
import { Consumer } from 'sqs-consumer';
import { QueueConfig } from '.';

export const sqsConsumerFactory = (
  config: QueueConfig,
  onMessage: (message: AWS.SQS.Message) => Promise<void>,
  onError: (err: Error) => Promise<void>,
) => {
  const sqsConsumer = Consumer.create({
    queueUrl: config.queueUrl,
    handleMessage: onMessage,
    sqs: new AWS.SQS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    }),
  });

  sqsConsumer.on('error', onError);
  sqsConsumer.on('processing_error', onError);
  sqsConsumer.on('timeout_error', onError);

  return sqsConsumer;
};
