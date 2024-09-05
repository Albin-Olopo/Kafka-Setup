## About the Project

KafkaJS is a modern Apache Kafka client for Node.js. It is compatible with Kafka 0.10+ and offers native support for 0.11 features.

KAFKA is a registered trademark of The Apache Software Foundation and has been licensed for use by KafkaJS. KafkaJS has no affiliation with and is not endorsed by The Apache Software Foundation.

This project is a Node.js application designed to interact with an Apache Kafka cluster. It leverages the kafkajs library for Kafka integration and the express framework to build a web server. The application includes functionalities for sending messages to Kafka topics and continuously generating data for a specific topic.

## Key Features:
1. Express-Based REST API:

Provides an endpoint to send messages to a Kafka topic.
Endpoint: POST /producer/purchase
Expects JSON payload with topic and data fields.
Converts the data to a JSON string and sends it to the specified Kafka topic.

2. Kafka Producer:

Establishes a connection to a Kafka cluster with multiple brokers.
Sends messages to Kafka topics based on requests from the API.

3. Automated Message Production:

Periodically sends messages to a Kafka topic (Topic1) every 3 seconds.
Generates random user data and prices to simulate continuous data flow.

4. Graceful Initialization and Error Handling:

Connects the Kafka producer at startup.
Handles connection errors and logs messages for troubleshooting.

## Usage Instructions:
Prerequisites:

Ensure Kafka is running and accessible at localhost:9092, localhost:9093, and localhost:9094.
Install Node.js and npm.

 ## Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/Albin-Olopo/Kafka-Setup.git
   cd Kafka-Setup
2. Start Kafka and ZooKeeper using Docker Compose:

```sh
docker-compose up
```
This will start ZooKeeper and Kafka brokers based on the configurations provided in docker-compose.yml.

3. Install dependencies:
```sh
    npm install
```
4. Run the Application:

Start the server:

  `node index.js`

The server will run on port 3000 by default. You can change the port by setting the PORT environment variable.

4. API Endpoints:

  Send Message:

    `POST /producer/purchase`

Request Body:
```JSON
{
  "topic": "your-topic-name",
  "data": {
    "key": "value"
  }
}
```
5. Automated Data Generation:

The server will automatically send messages to Topic1 every 3 seconds.

## Error Handling:
Logs errors to the console for both Kafka connection issues and message sending problems.
This application provides a simple interface for producing messages to Kafka and simulating a continuous stream of data, useful for testing and development purposes in Kafka-based systems.

## Contact
For questions or support, please open an issue or contact albin.alex@olopo.app.
