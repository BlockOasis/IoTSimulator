const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');

// Read the configuration from the config.json file
const configPath = path.join(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const brokerIp = config.brokerIp;
const port = config.port;
const topic = config.topic;
const csvFilePath = config.csvFilePath;


// Create a write stream to log the published data
const logFilePath = path.join(__dirname, '../', 'logfiles', 'stderr.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Function to read the CSV file and send its content as a message
function sendCsvAsMessage() {
  fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading CSV file:', err);
      return;
    }

    const rows = data.split('\n');
    const validRows = rows.filter(row => row.trim() !== ''); // Remove empty rows
    const attributes = validRows.shift().split(','); // Extract attribute names from the first row

    const client = mqtt.connect(`mqtt://${brokerIp}:${port}`);

    client.on('connect', () => {
      console.log('Connected to MQTT broker');

      // Publish the messages to the topic with the specified interval
      const messageInterval = setInterval(() => {
        if (validRows.length > 0) {
          const row = validRows.shift().split(',');
          const message = {};

          // Create a JSON object with attribute names as keys and row values as values
          for (let i = 0; i < attributes.length; i++) {
            message[attributes[i]] = row[i].trim();
          }

          // Add the timestamp from the IoT device with the key "timestampFromIotDevice"
          message.timestampFromIotDevice = Math.floor(Date.now() / 1000);

          // Check if the message contains "NULL" and avoid sending it
          if (Object.values(message).includes('NULL')) {
            //console.log('Skipping NULL value:', message);
            logStream.write(`Skipping NULL value: ${JSON.stringify(message)}\n`);
          } else {
            client.publish(topic, JSON.stringify(message), (err) => {
              if (err) {
                console.error('Error publishing message:', err);
              } else {
                //console.log('Message published:', message);
                logStream.write(`Message published: ${JSON.stringify(message)}\n`);
              }
            });
          }
        } else {
          clearInterval(messageInterval); // Stop the interval when all rows are processed
          client.end(); // Disconnect the client after publishing all the messages
          console.log('Disconnected from MQTT broker');
          logStream.end(); // Close the log stream when the script is finished
        }
      }, 5000); // Interval time in milliseconds (e.g., 5000 ms = 5 seconds)
    });
  });
}

// Initial call to send the CSV file content as messages
sendCsvAsMessage();
