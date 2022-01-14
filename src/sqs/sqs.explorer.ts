import { Injectable } from "@nestjs/common";
import { Provider } from "@nestjs/common/interfaces";
import { DiscoveryService } from "@nestjs/core";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import { ModulesContainer } from "@nestjs/core/injector/modules-container";
import { MetadataScanner } from "@nestjs/core/metadata-scanner";
import { QueueMessageHandler } from "./queue-message-handler";
// import { SqsMessageHandlerMetadataConfiguration, SQS_MESSAGE_HANDLER } from "./sqs.decorator";

@Injectable()
export class SqsExplorer {
    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataScanner: MetadataScanner,
    ) { }

    // TODO: next step: { handler, ...sqsConsumerConfig}

    /**
     * Find all classes marked with @Queue
     */
    public explore(): QueueMessageHandler[] {

        // Find all providers in the modules
        const providers = this.discoveryService.getProviders();

        const queueMessageHandlers = providers.map((wrapper) => {
            const instance = wrapper.instance;

            if (instance == null) { return null; }

            const prototype = Object.getPrototypeOf(instance);
            
            const isQueueMessageHandler = prototype instanceof QueueMessageHandler;

            if (isQueueMessageHandler === false)
            {
                return null;
            }

            return instance;
        })

        .filter(x => x)

        return queueMessageHandlers;

        // Flatten all the providers into an array of objects

        // find the classes marked with @Queue
        // const queues = instanceWrappers
        //     .map((wrapper) => {
        //         const instance = wrapper.instance;
        //         const instancePrototype = Object.getPrototypeOf(instance);
        //         // const handlerClass = Reflect.getMetadata(SQS_MESSAGE_HANDLER, instance);
        //         // if (handlerClass == null) {
        //         //     return null;
        //         // }

        //         this.metadataScanner.scanFromPrototype(
        //             instance,
        //             instancePrototype,
        //             name => console.log(name)
        //           );

        //         // return this.metadataScanner.scanFromPrototype(
        //         //   instance,
        //         //   instancePrototype,
        //         //   method => this.exploreMethodMetadata(instancePrototype, method),
        //         // );
        //     })
        // //   .reduce((prev, curr) => prev.concat(curr));

        return []
    }
}

//   public exploreMethodMetadata(
//     instancePrototype: Controller,
//     methodKey: string,
//   ): RabbitSubscriberMetadataConfiguration | null {
//     const targetCallback = instancePrototype[methodKey];
//     const handler = Reflect.getMetadata(RABBITMQ_SUBSCRIBER, targetCallback);
//     if (handler == null) {
//       return null;
//     }
//     return handler;
//   }
// }