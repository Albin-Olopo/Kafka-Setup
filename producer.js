const express = require('express');
const { Kafka } = require('kafkajs');

// Create an Express application
const app = express();
app.use(express.json()); // To parse JSON bodies

// Create a Kafka instance with multiple brokers
const kafka = new Kafka({
  clientId: 'rule-engine',
  brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'], // List of Kafka brokers
});

// Create a producer instance
const producer = kafka.producer();

// Connect the producer
producer.connect().then(() => {
  console.log('Producer connected to Kafka');
}).catch(err => {
  console.error('Failed to connect producer:', err);
});

// Define an endpoint to send a message
app.post('/producer/purchase', async (req, res) => {
  const { topic, data } = req.body;



  try {
    // Send message to the specified topic
    const result = await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(data), // Convert object to JSON string,
        }
      ],
    });

    // Log the result and send a success response
    console.log('Message sent successfully:', result);
    res.status(200).json({
      message: 'Message sent successfully',
      result: result
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// a function which keeps on sending data to the kafka topic
async function sendMessages() {
  let counter = 0;
  try {
    // Send a message every 5 seconds
    setInterval(async () => {
      const userId = 'user' + counter++;
      const result = await producer.send({
        topic: 'Topic1',
        messages: [
          {
            value: JSON.stringify({ userId: userId, price: Math.random() * 1000 }),
          }
        ],
      });

      console.log('Message sent successfully:', result);
    }, 3000);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}
 

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  sendMessages();
});
