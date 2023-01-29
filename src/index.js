const { Queue: QueueMQ } = require('bullmq');
const fastify = require('fastify');
const { authen } = require('./auth');

const redisOptions = {
  host: process.env.R7PLATFORM_QUEUEUI_REDIS_HOST || 'localhost',
  port: Number(process.env.R7PLATFORM_QUEUEUI_REDIS_PORT) || 6379,
  username: process.env.R7PLATFORM_QUEUEUI_REDIS_USERNAME || 'admin',
  password: process.env.R7PLATFORM_QUEUEUI_REDIS_PASSWORD || 'admin',
  tls: false,
};

const KK_QUEUE_NAME = process.env.R7PLATFORM_QUEUEUI_KK_QUEUE_NAME || 'KHONKAEN';
const MSK_QUEUE_NAME = process.env.R7PLATFORM_QUEUEUI_MSK_QUEUE_NAME || 'MAHASARAKHAM';
const ROIET_QUEUE_NAME = process.env.R7PLATFORM_QUEUEUI_ROIET_QUEUE_NAME || 'ROIET';
const KALASIN_QUEUE_NAME = process.env.R7PLATFORM_QUEUEUI_KALASIN_QUEUE_NAME || 'KALASIN';

const createQueueMQ = (name) => new QueueMQ(name, { connection: redisOptions });

const run = async () => {
  const KK = createQueueMQ(KK_QUEUE_NAME);
  const MSK = createQueueMQ(MSK_QUEUE_NAME);
  const ROI = createQueueMQ(ROIET_QUEUE_NAME);
  const KLS = createQueueMQ(KALASIN_QUEUE_NAME);

  const app = fastify();

  app.register(authen, { queue: [KK, MSK, ROI, KLS] });

  const port = process.env.R7PLATFORM_QUEUEUI_PORT ? Number(process.env.R7PLATFORM_QUEUEUI_PORT) : 3031
  await app.listen({ port }, (err, address) => {

    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }

    console.log(`Server is now listening on ${address}:3301`);
    console.log(`For login, open http://${address}:3301/login`);
  });
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});