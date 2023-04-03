#!/usr/bin/env node

import process from "node:process";
import { Buffer } from "node:buffer";
import amqp from "amqplib";

const args = process.argv.slice(2);
const key = args.length > 0 ? args[0] : "info";
const message = args.slice(1).join(" ") || "Hello World!";

async function main() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const exchangeTopic = "topic_logs";
  await channel.assertExchange(exchangeTopic, "topic", { durable: false });
  channel.publish(exchangeTopic, key, Buffer.from(message));
  console.log(" [x] Sent %s:'%s'", key, message);
  await channel.close();
  return connection.close();
}

main().catch(console.error);
