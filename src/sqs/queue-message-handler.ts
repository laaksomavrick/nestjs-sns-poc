export abstract class QueueMessageHandler {
  public abstract onMessage(data: AWS.SQS.Message): Promise<void>;
  public abstract onError(err: Error): Promise<void>;
  public abstract onProcessingError(err: Error): Promise<void>;
  public abstract onTimeout(err: Error): Promise<void>;
}
