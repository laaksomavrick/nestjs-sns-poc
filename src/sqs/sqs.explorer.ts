import { Injectable } from "@nestjs/common";
import { DiscoveryService } from "@nestjs/core";
import { QueueConfig, SQS_QUEUE_HANDLER } from ".";
import { QueueMessageHandler } from "./queue-message-handler";

export interface SqsMessageHandler {
    handler: QueueMessageHandler;
    config: QueueConfig
}

@Injectable()
export class SqsExplorer {
    constructor(
        private readonly discoveryService: DiscoveryService,
    ) { }

    /**
     * Find all classes marked with @Queue that are derived from QueueMessageHandler
     */
    public explore(): SqsMessageHandler[] {

        const providers = this.discoveryService.getProviders();

        const queueMessageHandlers = providers.map((wrapper) => {
            const instance = wrapper.instance;

            if (instance == null) { return null; }

            const prototype = Object.getPrototypeOf(instance);

            const isQueueMessageHandler = prototype instanceof QueueMessageHandler;
            const config = Reflect.getMetadata(SQS_QUEUE_HANDLER, prototype);

            if (isQueueMessageHandler === false) {
                return null;
            }

            if (config == null) {
                return null;
            }

            return {
                handler: instance,
                config
            }

        })
            .filter(x => x && x.handler && x.config)

        return queueMessageHandlers;

    }
}
