#!/usr/bin/env node

import process from 'node:process';
import {basename} from 'node:path';
import amqp, {ConsumeMessage} from 'amqplib';

const keys = process.argv.slice(2);
if (keys.length === 0) {
	console.log('Usage: %s pattern [pattern...]',
		basename(process.argv[1]));
	process.exit(1);
}

function logMessage(message: ConsumeMessage | undefined): void {
	console.log(' [x] %s:\'%s\'', message?.fields.routingKey, message?.content.toString());
}

async function main() {
	const connection = await amqp.connect('amqp://localhost');

	process.once('SIGINT', () => {
		void connection.close();
	});

	const channel = await connection.createChannel();
	const exchangeTopic = 'topic_logs';
	await channel.assertExchange(exchangeTopic, 'topic', {durable: false});
	const {queue} = await channel.assertQueue('', {exclusive: true});

	await Promise.all(keys.map(key => channel.bindQueue(queue, exchangeTopic, key)));

	await channel.consume(queue, logMessage as any, {noAck: true});

	console.log(' [*] Waiting for logs. To exit press CTRL+C.');
}

main().catch(console.error);

