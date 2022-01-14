// import { SetMetadata } from "@nestjs/common";

// export const SQS_MESSAGE_HANDLER = "SQS_MESSAGE_HANDLER";

// export interface SqsMessageHandlerMetadataConfiguration {
//   target: string;
// }

// export const Queue = () => {
//   return (target: any) => {
//     SetMetadata<string, SqsMessageHandlerMetadataConfiguration>(
//         SQS_MESSAGE_HANDLER,
//       {
//         target: target.constructor.name,
//       },
//     )(target,);
//   };
// };