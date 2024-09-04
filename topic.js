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

// Create an admin instance
const admin = kafka.admin();

// Connect the admin
async function connectAdmin() {
  try {
    await admin.connect();
    console.log('Admin connected to Kafka');
  } catch (error) {
    console.error('Failed to connect admin:', error);
  }
}

connectAdmin();

// Define an endpoint to list topics
app.get('/topics', async (req, res) => {
  try {
    // List existing topics
    const topics = await admin.listTopics();
    res.status(200).json({ topics });
  } catch (error) {
    console.error('Error listing topics:', error);
    res.status(500).json({ error: 'Failed to list topics' });
  }
});

// Define an endpoint to create a topic
app.post('/topics', async (req, res) => {
  const { topic, numPartitions, replicationFactor } = req.body;

  // Validate input
  if (!topic || typeof numPartitions !== 'number' || typeof replicationFactor !== 'number') {
    return res.status(400).json({ error: 'Invalid input. Ensure "topic" is a string, "numPartitions" and "replicationFactor" are numbers.' });
  }

  try {
    // Check existing topics to avoid duplicates
    const existingTopics = await admin.listTopics();

    // Create new topic if it does not exist
    if (!existingTopics.includes(topic)) {
      await admin.createTopics({
        topics: [
          {
            topic,
            numPartitions, // Number of partitions
            replicationFactor, // Replication factor
          }
        ],
      });
      res.status(201).json({ message: 'Topic created successfully', topic });
    } else {
      res.status(200).json({ message: 'Topic already exists' });
    }
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

// api to know thw current topic and replication factor and number of partitions
app.get('/topic/:topic', async (req, res) => {
  const { topic } = req.params;

  try {
    // Get topic details
    const topicDetails = await admin.fetchTopicMetadata({
      topics: [topic],
    });

    res.status(200).json({ topic,topicDetails});
  } catch (error) {
    console.error('Error getting topic details:', error);
    res.status(500).json({ error: 'Failed to get topic details' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Disconnect the admin when the server is closed
process.on('SIGINT', async () => {
  await admin.disconnect();
  console.log('Admin disconnected from Kafka');
  process.exit(0);
});
