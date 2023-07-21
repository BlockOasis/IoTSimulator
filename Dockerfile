# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json ./

# Install the dependencies
RUN npm install

# Create the src directory
RUN mkdir -p /app/src

# Copy the mqttSender.js and config files to the container
COPY src/mqttSender.js ./src/
COPY config.json ./

# Create the logfiles directory
RUN mkdir -p /app/logfiles

# Set the command to run the mqttSender.js script with the required inputs
CMD ["node","src/mqttSender.js"]