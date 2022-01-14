import * as AWS from 'aws-sdk';
import { Consumer } from 'sqs-consumer';
import { QueueConfig } from '.';
import { QueueMessageHandler } from './queue-message-handler';

export const sqsConsumerFactory = (messageHandler: QueueMessageHandler, config: QueueConfig) => {
    const sqsConsumer = Consumer.create({
        queueUrl: config.queueUrl,
        handleMessage: messageHandler.onMessage,
        sqs: new AWS.SQS({
            region: config.region,
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey
        })
    });

    sqsConsumer.on('error', messageHandler.onError);
    sqsConsumer.on('processing_error', messageHandler.onProcessingError);
    sqsConsumer.on('timeout_error', messageHandler.onTimeout);

    return sqsConsumer;
}