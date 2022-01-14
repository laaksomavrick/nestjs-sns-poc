/* 
@Queue
    - onMessage
    - onError
    - onProcessingError
    - onTimeout
*/

import { Consumer } from 'sqs-consumer';
import * as AWS from 'aws-sdk';
import config from './config';

console.log(config.get('sqs'))

AWS.config.update({
  region: config.get('sqs.region'),
  accessKeyId: config.get('sqs.accessKeyId'),
  secretAccessKey: config.get('sqs.secretAccessKey') 
});

export const sqsConsumer = Consumer.create({
  queueUrl: config.get('sqs.queueUrl'),
  handleMessage: async (message) => {
      console.log(message)
  },
  sqs: new AWS.SQS()
});

sqsConsumer.on('error', (err) => {
  console.error(err.message);
});

sqsConsumer.on('processing_error', (err) => {
  console.error(err.message);
});

sqsConsumer.on('timeout_error', (err) => {
 console.error(err.message);
});

// app.start();
