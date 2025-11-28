import { consumer } from "./kafka";
import { createOrder } from "./order";

export const runKafkaSubscriptions = async () => {
  await consumer.subscribe([
    {
      topicName: "payment.successful",
      topicHandler: async (message: any) => {
        console.log("Received message: payment.successful", message);

        const order = message.value;
        await createOrder(order);
        console.log("✅ Order created successfully in MongoDB!");
      },
    },
  ]);
};
