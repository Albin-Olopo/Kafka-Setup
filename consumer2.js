const { Kafka } = require('kafkajs');

// Create a Kafka instance with multiple brokers
const kafka = new Kafka({
  clientId: 'rule-engine',
  brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'], // List of Kafka brokers
});

// Create a consumer instance
const consumer = kafka.consumer({ groupId: 'GROUP1' });

async function run() {
  try {
    // Connect the consumer
    await consumer.connect();
    console.log('Consumer connected to Kafka');

    // Subscribe to a topic
    await consumer.subscribe({ topic: 'redemption', fromBeginning: true });
    console.log('Subscribed to topic "redemption"');

    // Define message handler
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        // Process each message
        const { value } = message;
        const parsedMessage = JSON.parse(value.toString());

        console.log(`Received message: ${JSON.stringify(parsedMessage)} from topic: ${topic}, partition: ${partition}`);
        // Add any additional message processing here
      },
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the consumer
run();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down consumer...');
  await consumer.disconnect();
  console.log('Consumer disconnected from Kafka');
  process.exit(0);
});
