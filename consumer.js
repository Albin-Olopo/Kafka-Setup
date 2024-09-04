const { Kafka } = require('kafkajs');
const os = require('os');

// Create a Kafka instance with multiple brokers
const kafka = new Kafka({
  clientId: 'rule-engine',
  brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'], // List of Kafka brokers
});

// Create a consumer instance
const consumer = kafka.consumer({ groupId: 'GROUP1' });

let isConsuming = true;

async function runConsumer() {
  try {
    // Connect the consumer
    await consumer.connect();
    console.log('Consumer connected to Kafka');

    // Subscribe to a topic
    await consumer.subscribe({ topic: 'purchase', fromBeginning: true });
    console.log('Subscribed to topic "purchase"');

    // Define message handler
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (isConsuming) {
          // Process each message
          const { value } = message;
          const parsedMessage = JSON.parse(value.toString());

          console.log(`Received message: ${JSON.stringify(parsedMessage)} from topic: ${topic}, partition: ${partition}`);
          // Add any additional message processing here
        }
      },
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Monitor system load and control consumer
async function monitorAndControlConsumer() {
  setInterval(() => {
    const { cpuLoad, memoryUsage } = getSystemLoad();
    
    // Log the current system load
    console.log(`CPU Load: ${(cpuLoad * 100).toFixed(2)}%`);
    console.log(`Memory Usage: ${(memoryUsage * 100).toFixed(2)}%`);
    
    if (cpuLoad > 0.8 || memoryUsage > 0.8) {
      if (isConsuming) {
        console.log('High load detected. Pausing consumer...');
        consumer.pause([{ topic: 'purchase' }]).catch(console.error);
        isConsuming = false;
      }
    } else {
      if (!isConsuming) {
        console.log('Load is normal. Resuming consumer...');
        consumer.resume([{ topic: 'purchase' }]).catch(console.error);
        isConsuming = true;
      }
    }
  }, 5000); // Check every 5 seconds
}

// Function to get system load
function getSystemLoad() {
  const cpus = os.cpus();
  const totalCores = cpus.length;
  let idle = 0;
  let total = 0;

  for (const cpu of cpus) {
    for (const type in cpu.times) {
      total += cpu.times[type];
    }
    idle += cpu.times.idle;
  }

  return {
    cpuLoad: 1 - (idle / total),
    memoryUsage: (os.totalmem() - os.freemem()) / os.totalmem()
  };
}

// Run the consumer and monitoring
(async () => {
  await runConsumer();
  monitorAndControlConsumer();
})();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down consumer...');
  await consumer.disconnect();
  console.log('Consumer disconnected from Kafka');
  process.exit(0);
});
