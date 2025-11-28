import { createStripeProduct, deleteStripeProduct } from "./stripeProduct";
import { consumer } from "./kafka";

export const runKafkaSubscriptions = async () => {
  await consumer.subscribe([
    {
      topicName: "product.created",
      topicHandler: async (message: any) => {
        // message zaten parse edilmiş geliyor, direkt kullan
        const product = message.value;
        console.log("Received message: product.created", product);

        await createStripeProduct(product);
      },
    },
    {
      topicName: "product.deleted",
      topicHandler: async (message: any) => {
        const productId = message.value;
        console.log("Received message: product.deleted", productId);

        await deleteStripeProduct(productId);
      },
    },
  ]);
};
