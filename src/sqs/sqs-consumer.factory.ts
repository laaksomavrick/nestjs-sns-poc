
import { Consumer } from 'sqs-consumer';
import * as AWS from 'aws-sdk';
import config from './config';
import { QueueMessageHandler } from './queue-message-handler';

// TODO: take decorator metadata which provides all dependencies
export const sqsConsumerFactory = (messageHandler: QueueMessageHandler) => {

    const sqsConsumer = Consumer.create({
        queueUrl: config.get('sqs.queueUrl'),
        handleMessage: messageHandler.onMessage,
        sqs: new AWS.SQS({
            region: config.get('sqs.region'),
            accessKeyId: config.get('sqs.accessKeyId'),
            secretAccessKey: config.get('sqs.secretAccessKey')
        })
    });

    sqsConsumer.on('error', messageHandler.onError);

    sqsConsumer.on('processing_error', messageHandler.onProcessingError);

    sqsConsumer.on('timeout_error', messageHandler.onTimeout);

    return sqsConsumer;

}