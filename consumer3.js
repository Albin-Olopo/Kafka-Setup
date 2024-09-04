const { Kafka } = require('kafkajs');
const winston = require('winston');

// Set up logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

// Create a Kafka instance
const kafka = new Kafka({
  clientId: 'rule-engine',
  brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'], // List of Kafka brokers
});

// Create a consumer instance
const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID || 'Group1' });

async function run() {
  try {
    await consumer.connect();
    logger.info('Consumer connected to Kafka');

    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC || 'Topic1', fromBeginning: true });
    logger.info('Subscribed to topic "purchase"');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const { value } = message;
          const parsedMessage = JSON.parse(value.toString());
          logger.info(`Received message: ${JSON.stringify(parsedMessage)} from topic: ${topic}, partition: ${partition}`);
          // Additional message processing
        } catch (err) {
          logger.error(`Failed to process message: ${err.message}`);
        }
      },
    });
  } catch (error) {
    logger.error('Error:', error);
  }
}

run();

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down consumer...');
  try {
    await consumer.disconnect();
    logger.info('Consumer disconnected from Kafka');
  } catch (err) {
    logger.error('Error during disconnect:', err);
  } finally {
    process.exit(0);
  }
});
