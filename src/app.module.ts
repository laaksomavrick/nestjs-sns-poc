import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TestMessageHandler } from './app.queue-message-handler';
import { AppService } from './app.service';
import { SqsModule } from './sqs/sqs.module';

@Module({
  imports: [SqsModule],
  controllers: [AppController],
  providers: [AppService, TestMessageHandler],
})
export class AppModule {}
