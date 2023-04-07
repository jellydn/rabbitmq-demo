// Package simplerpc is a simple RPC server that will return the sum of two numbers
package main

import (
	"testing"

	"github.com/streadway/amqp"
)

func TestHandleDelivery(t *testing.T) {
	type args struct {
		ch *amqp.Channel
		d  amqp.Delivery
	}
	tests := []struct {
		name string
		args args
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			HandleDelivery(tt.args.ch, tt.args.d)
		})
	}
}
