# nest-sns-poc

A simple proof-of-concept for a "nest-y" abstraction around consuming messages from an SQS queue.

Specifically, the following decorators have been created for usage:

- `@Queue`
- `@OnMessage`
- `@OnError`

e.g.,

```
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
```

## installation / usage

- `nvm use`
- `yarn`
- `cp .env.example .env` and then fill in your credentials
- `yarn start`
- send a message to the sqs queue and observe
