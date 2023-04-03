#!/usr/bin/env node

import process from "node:process";
import { basename } from "node:path";
import amqp, { type ConsumeMessage } from "amqplib";

const keys = process.argv.slice(2);
if (keys.length === 0) {
  console.log("Usage: %s pattern [pattern...]", basename(process.argv[1]));
  process.exit(1);
}

function logMessage(message: ConsumeMessage | undefined) {
  console.log(
    " [x] %s:'%s'",
    message?.fields.routingKey,
    message?.content.toString()
  );
}

async function main() {
  const connection = await amqp.connect("amqp://localhost");

  process.once("SIGINT", async () => {
    await connection.close();
  });

  const channel = await connection.createChannel();
  const exchangeTopic = "topic_logs";
  await channel.assertExchange(exchangeTopic, "topic", { durable: false });
  const { queue } = await channel.assertQueue("", { exclusive: true });

  await Promise.all(
    keys.map(async (key) => channel.bindQueue(queue, exchangeTopic, key))
  );

  // @ts-expect-error - TS2345: Argument of type 'ConsumeMessage | undefined' is not assignable to parameter of type 'ConsumeMessage'.
  await channel.consume(queue, logMessage, { noAck: true });

  console.log(" [*] Waiting for logs. To exit press CTRL+C.");
}

main().catch(console.error);
