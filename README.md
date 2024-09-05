# Kafka Setup

This repository contains scripts and configurations to set up Apache Kafka for development and production environments. The setup includes Kafka brokers, ZooKeeper, and example configuration files.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Contact](#contact)


## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Java**: Kafka requires Java 8 or later.
- **Docker** (optional): For using Docker-based setups.
- **Docker Compose** (optional): For using Docker Compose-based setups.

## Installation

### Using Docker

1. Clone the repository:
   ```sh
   git clone https://github.com/Albin-Olopo/Kafka-Setup.git
   cd Kafka-Setup
2. Start Kafka and ZooKeeper using Docker Compose:

```sh
docker-compose up
```
This will start ZooKeeper and Kafka brokers based on the configurations provided in docker-compose.yml.

## Manual Installation
1. Clone the repository:

```sh
git clone https://github.com/Albin-Olopo/Kafka-Setup.git
cd Kafka-Setup
```

2. Install Kafka and ZooKeeper manually by following the instructions in the respective directories.

## Configuration
The configuration files are located in the ```config```directory:

```server.properties```: Configuration file for Kafka brokers.

```zookeeper.properties```: Configuration file for ZooKeeper.

Adjust these files as necessary for your environment.

## Usage
## Docker
To list Kafka topics:

```sh
docker exec -it kafka-container-name kafka-topics.sh --list --zookeeper zookeeper-container-name:2181
```
To create a new Kafka topic:

```sh
docker exec -it kafka-container-name kafka-topics.sh --create --zookeeper zookeeper-container-name:2181 --replication-factor 1 --partitions 1 --topic your-topic-name
```
## Manual
Start ZooKeeper:

```sh
zookeeper-server-start.sh config/zookeeper.properties
```
Start Kafka Broker:

```sh
kafka-server-start.sh config/server.properties
```
List Kafka topics:

```sh
kafka-topics.sh --list --zookeeper localhost:2181
```
Create a new Kafka topic:

```sh
kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic your-topic-name
```

## Contact
For questions or support, please open an issue or contact albin.alex@olopo.app.
