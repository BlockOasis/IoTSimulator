# MQTT Sender System Readme

This Readme provides an overview and instructions for the MQTT Sender system, which is responsible for reading data from a CSV file and publishing it as MQTT messages to a broker.

## Overview

The MQTT Sender system consists of a Node.js script (`mqttSender.js`) that reads data from a CSV file (`data.csv`) and publishes it as MQTT messages to an MQTT broker. The system is designed to run in a Docker container for easy deployment and scalability.

## Prerequisites

Before running the MQTT Sender system, make sure you have the following prerequisites installed on your system:

1. Docker: Install Docker on your machine to run the system in a containerized environment.

## Getting Started

To set up and run the MQTT Sender system, follow the steps below:

1. **Clone the repository:** Start by cloning this repository to your local machine.

2. **Make sure the port (1883) is open:** Before starting the MQTT Sender system, check if port 1883 is open and close any process that might be using it. Run the following command:

   ```bash
   sudo kill $(sudo netstat -tulpn | grep 1883 | awk '{print $7}' | awk -F '/' '{print $1}')
   ```
3. **Update the configuration:** Open the `config.json` file and update the following parameters as needed:

   - `brokerIp`: The IP address or hostname of the MQTT broker.
   - `port`: The MQTT broker's port to connect to.
   - `topic`: The topic to which the messages will be published.
   - `csvFilePath`: The relative path to the CSV file containing the data to publish.

4. **Place the CSV data:** Put your dataset in the `data` directory with the filename `data.csv`. This CSV file should contain the data that you want to publish as MQTT messages.

5. **Build the Docker image:** Open a terminal or command prompt, navigate to the root directory of the project, and run the following command to build the Docker image:

   ```bash
   docker build -t mqtt_publisher .
    ```

6. **Run the MQTT Sender system:** After successfully building the Docker image, use `docker-compose` to run the system:

    ```bash
    docker-compose up
    ```
    This command will start the MQTT broker (EMQX) and the MQTT Sender container, which will read the data from the CSV file and publish it as MQTT messages to the specified topic.

7. **Check the logs:** During execution, the MQTT Sender script will log its activities to the `stderr.log` file inside the `logfiles` directory. You can check this log file for any issues or to monitor the messages being published.

8. **Stop the system:** To stop the MQTT Sender system, use the following command:

    ```bash
    docker-compose down
    ```

## Understanding the Code
The `mqttSender.js` script reads the configuration from the `config.json` file, establishes a connection to the MQTT broker, and then reads the CSV file's content to publish it as MQTT messages. The script sends each row from the CSV file as a separate message to the MQTT broker, with the attributes defined in the CSV file's header row.

The `Dockerfile` contains instructions to build the Docker image for the MQTT Sender system. It installs the required dependencies, sets up the working directory, and copies the necessary files (`mqttSender.js` and `config.json`) into the container. When the container is run, the `mqttSender.js` script is executed, and the data is published to the MQTT broker.

