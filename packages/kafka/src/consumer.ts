import { Consumer, Kafka } from "kafkajs";

export const createConsumer = (kafka: Kafka, groupId: string) => {
  const consumer: Consumer = kafka.consumer({ groupId, allowAutoTopicCreation: true });

  const connect = async () => {
    await consumer.connect();
    console.log(`Kafka consumer connected: ${groupId}`);
  };

  const subscribe = async (
    topics: {
      topicName: string;
      topicHandler: (message: any) => Promise<void>;
    }[]
  ) => {
    // Topic'lerin oluşturulması için admin client kullanılabilir
    // veya producer ilk mesajı gönderdiğinde otomatik oluşturulur
    await consumer.subscribe({
      topics: topics.map((topic) => topic.topicName),
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const topicConfig = topics.find((t: any) => t.topicName === topic);
          if (topicConfig) {
            const value = message.value?.toString();

            if (value) {
              await topicConfig.topicHandler(JSON.parse(value.toString()));
            }
          }
        } catch (error) {
          console.log("Error processing message:", error);
        }
      },
    });
  };

  const disconnect = async () => {
    await consumer.disconnect();
    console.log(`Kafka consumer disconnected: ${groupId}`);
  };

  return { connect, subscribe, disconnect };
};
