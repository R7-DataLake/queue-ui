const { Queue: QueueMQ } = require('bullmq');
const fastify = require('fastify');
const { authen } = require('./auth');

const redisOptions = {
  host: process.env.R7PLATFORM_QUEUEUI_REDIS_HOST || 'localhost',
  port: Number(process.env.R7PLATFORM_QUEUEUI_REDIS_PORT) || 6379,
  password: process.env.R7PLATFORM_QUEUEUI_REDIS_PASSWORD || 'admin',
  tls: false,
};

const envZones = process.env.R7PLATFORM_QUEUEUI_PLATFORM_ZONE_LIST || 'KHONKAEN,MAHASARAKHAM,ROIET,KALASIN';

let zones = envZones.split(',');
let queues = [];

const createQueueMQ = (zone) => new QueueMQ(zone, { connection: redisOptions });

const run = async () => {

  zones.forEach(zone => {
    const queue = createQueueMQ(zone);
    queues.push(queue);
  });

  const app = fastify();

  app.register(authen, { queue: queues });

  const port = process.env.R7PLATFORM_QUEUEUI_PORT ? Number(process.env.R7PLATFORM_QUEUEUI_PORT) : 3000;

  await app.listen({ port, host: '0.0.0.0' }, (err, address) => {

    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }

    console.log(`Server is now listening on ${address}:3000`);
    console.log(`For login, open http://${address}:3000/login`);
  });
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});