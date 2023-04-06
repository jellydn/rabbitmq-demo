#!/bin/bash

# Function to start the container
start_container() {
    # Build the Docker image
    docker build -t my-rabbitmq .

    # Run the Docker container
    docker run -d --name my-rabbitmq -p 5672:5672 -p 15672:15672 my-rabbitmq
}

# Function to stop the container
stop_container() {
    # Stop the Docker container
    docker stop my-rabbitmq

    # Remove the Docker container
    docker rm my-rabbitmq
}

# Check the command line arguments
if [ "$1" == "start" ]; then
    start_container
elif [ "$1" == "stop" ]; then
    stop_container
else
    echo "Usage: $0 start|stop"
fi
