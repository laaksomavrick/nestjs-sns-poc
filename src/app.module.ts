import { Module } from '@nestjs/common';
import { TestMessageHandler } from './app.queue-message-handler';
import { AppService } from './app.service';
import { SqsModule } from './sqs/sqs.module';

@Module({
  imports: [SqsModule],
  providers: [AppService, TestMessageHandler],
})
export class AppModule {}
