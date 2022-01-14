import { Injectable } from "@nestjs/common";
import { QueueMessageHandler } from "./sqs/queue-message-handler";
// import { Queue } from "./sqs/sqs.decorator";

@Injectable()
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