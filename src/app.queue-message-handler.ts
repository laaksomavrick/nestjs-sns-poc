import { Injectable } from '@nestjs/common';
import { OnError, OnMessage, Queue } from './sqs';
import config from './config';

@Injectable()
@Queue({
  queueUrl: config.get('sqs.queueUrl'),
  region: config.get('sqs.region'),
  accessKeyId: config.get('sqs.accessKeyId'),
  secretAccessKey: config.get('sqs.secretAccessKey'),
})
export class TestMessageHandler {
  @OnMessage()
  public onMessage(data: AWS.SQS.Message): Promise<void> {
    console.log(data);
    return null;
  }

  @OnError()
  public onError(err: Error): Promise<void> {
    console.log(err.message);
    return null;
  }
}
