import amqp from "amqplib";
import readline from "readline";

async function rpcClient(a: number, b: number) {
  const conn = await amqp.connect("amqp://localhost:5672");
  const channel = await conn.createChannel();

  const q = await channel.assertQueue("", { exclusive: true });
  const correlationId =
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString();

  const numbers = [a, b];
  const message = Buffer.from(JSON.stringify(numbers));
  channel.sendToQueue("rpc_queue", message, {
    correlationId,
    replyTo: q.queue,
  });

  return new Promise<number>((resolve, reject) => {
    channel
      .consume(
        q.queue,
        (msg) => {
          if (msg?.properties?.correlationId === correlationId) {
            const result = JSON.parse(msg.content.toString()) as number;
            resolve(result);
            setTimeout(() => {
              conn.close().catch(console.error);
            }, 500);
          }
        },
        { noAck: true }
      )
      .catch(reject);
  });
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter two numbers separated by space: ", async (input) => {
    const numbers = input.split(" ").map(Number);
    const a = numbers[0];
    const b = numbers[1];

    try {
      const result = await rpcClient(a, b);
      console.log(`Sum(${a}, ${b}) = ${result}`);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      rl.close();
    }
  });
}

main().catch(console.error);
