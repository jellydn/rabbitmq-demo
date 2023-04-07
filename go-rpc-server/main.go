// Package simplerpc is a simple RPC server that will return the sum of two numbers
package main

import (
	"encoding/json"
	"log"

	"simplerpc/lib"

	"github.com/streadway/amqp"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

// HandleDelivery handles the delivery of a message
func HandleDelivery(ch *amqp.Channel, d amqp.Delivery) {
	var numbers []int
	json.Unmarshal(d.Body, &numbers)
	a, b := numbers[0], numbers[1]
	log.Printf("Received %d and %d", a, b)
	result := lib.Sum(a, b)
	log.Printf("Returning %d", result)
	response, _ := json.Marshal(result)

	err := d.Ack(false)
	failOnError(err, "Failed to acknowledge message")

	log.Printf("Publishing response to %s with CorrelationId %s", d.ReplyTo, d.CorrelationId)
	err = ch.Publish("", d.ReplyTo, false, false, amqp.Publishing{
		ContentType:   "application/json",
		CorrelationId: d.CorrelationId,
		Body:          response,
	})
	failOnError(err, "Failed to publish response")
}

func main() {
	conn, err := amqp.Dial("amqp://localhost:5672/")
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare("rpc_queue", false, false, false, false, nil)
	failOnError(err, "Failed to declare a queue")

	msgs, err := ch.Consume(q.Name, "", false, false, false, false, nil)
	failOnError(err, "Failed to register a consumer")

	log.Println("Awaiting RPC requests")
	for d := range msgs {
		go HandleDelivery(ch, d)
	}
}
