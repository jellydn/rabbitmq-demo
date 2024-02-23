# Use the official RabbitMQ image as the base image
FROM rabbitmq:3.13-management

# Set environment variables for RabbitMQ
ENV RABBITMQ_ERLANG_COOKIE="my_secret_cookie"

# Expose ports for the RabbitMQ server and management interface
EXPOSE 5672 15672

# Start RabbitMQ server
CMD ["rabbitmq-server"]
