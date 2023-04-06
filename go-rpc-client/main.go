// Package main provides simple RPC client
package main

import (
	"fmt"
	"log"
	"os"

	"github.com/streadway/amqp"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

// Usaeg: go run main.go '{"a": 1, "b": 2}'
func main() {
	conn, err := amqp.Dial("amqp://localhost:5672/")
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"",
		false,
		false,
		true,
		false,
		nil,
	)
	failOnError(err, "Failed to declare a queue")

	msgs, err := ch.Consume(
		q.Name,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Failed to register a consumer")

	// define random correlation ID
	corrID := "123abc"

	err = ch.Publish(
		"",
		"rpc_queue",
		false,
		false,
		amqp.Publishing{
			ContentType:   "application/json",
			CorrelationId: corrID,
			ReplyTo:       q.Name,
			Body:          []byte(os.Args[1]),
		})
	failOnError(err, "Failed to publish a message")

	for d := range msgs {
		if corrID == d.CorrelationId {
			fmt.Println("Received:", string(d.Body))
			break
		}
	}
}
