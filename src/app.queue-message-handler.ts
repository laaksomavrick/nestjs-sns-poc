import { Injectable } from "@nestjs/common";
import { QueueMessageHandler } from "./sqs/queue-message-handler";
import { Queue } from "./sqs";
import config from "./config";

@Injectable()
@Queue({
    queueUrl: config.get('sqs.queueUrl'),
    region: config.get('sqs.region'),
    accessKeyId: config.get('sqs.accessKeyId'),
    secretAccessKey: config.get('sqs.secretAccessKey')
})
export class TestMessageHandler extends QueueMessageHandler {

    public onMessage(data: AWS.SQS.Message): Promise<void> {
        console.log(data)
        return null;
    }

    public onError(err: Error): Promise<void> {
        console.log(err.message)
        return null;
    }

    public onProcessingError(err: any): Promise<void> {
        console.log(err.message)
        return null;
    }

    public onTimeout(err: Error): Promise<void> {
        console.log(err.message)
        return null;
    }

}