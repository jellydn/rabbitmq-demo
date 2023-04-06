import amqp from "amqplib/callback_api";
import z from "zod";

const multiplySchema = z.object({
  a: z.number(),
  b: z.number(),
});

function multiply(a: number, b: number) {
  return a * b;
}

function startServer() {
  amqp.connect("amqp://localhost:5672/", (error, connection) => {
    if (error) {
      throw new Error(
        (error as Error)?.message ?? "Error connecting to RabbitMQ"
      );
    }

    connection.createChannel((err, channel) => {
      if (err) {
        throw new Error((err as Error)?.message ?? "Error creating channel");
      }

      const queue = "rpc_queue";
      channel.assertQueue(queue, { durable: false });
      channel.prefetch(1);

      console.log(" [x] Awaiting RPC requests");

      channel.consume(
        queue,
        (msg) => {
          let a: number;
          let b: number;
          try {
            const data = multiplySchema.parse(
              JSON.parse(msg?.content?.toString() ?? "{}")
            );
            a = data.a;
            b = data.b;
            console.log(` [.] multiply(${a}, ${b})`);
          } catch (error) {
            console.log(" [.] Invalid request", error);

            channel.sendToQueue(
              String(msg?.properties?.replyTo ?? ""),
              Buffer.from("error: invalid input format"),
              {
                correlationId: String(msg?.properties?.correlationId ?? ""),
              }
            );

            if (msg) {
              channel.ack(msg);
            }

            return;
          }

          const result = multiply(a, b);

          channel.sendToQueue(
            String(msg?.properties?.replyTo ?? ""),
            Buffer.from(result.toString()),
            {
              correlationId: String(msg?.properties?.correlationId ?? ""),
            }
          );

          if (msg) {
            channel.ack(msg);
          }
        },
        { noAck: false }
      );
    });
  });
}

startServer();
