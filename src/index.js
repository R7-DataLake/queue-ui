const { Queue: QueueMQ } = require('bullmq');
const fastify = require('fastify');
const { authen } = require('./auth');

const redisOptions = {
  host: process.env.R7QUEUE_REDIS_HOST || 'localhost',
  port: Number(process.env.R7QUEUE_REDIS_PORT) || 6379,
  username: process.env.R7QUEUE_REDIS_USERNAME || 'admin',
  password: process.env.R7QUEUE_REDIS_PASSWORD || 'admin',
  tls: false,
};

const KK_QUEUE_NAME = process.env.R7QUEUE_KK_QUEUE_NAME || 'KHONKAEN';
const MSK_QUEUE_NAME = process.env.R7QUEUE_MSK_QUEUE_NAME || 'MAHASARAKHAM';
const ROIET_QUEUE_NAME = process.env.R7QUEUE_ROIET_QUEUE_NAME || 'ROIET';
const KALASIN_QUEUE_NAME = process.env.R7QUEUE_KALASIN_QUEUE_NAME || 'KALASIN';

const createQueueMQ = (name) => new QueueMQ(name, { connection: redisOptions });

const run = async () => {
  const KK = createQueueMQ(KK_QUEUE_NAME);
  const MSK = createQueueMQ(MSK_QUEUE_NAME);
  const ROI = createQueueMQ(ROIET_QUEUE_NAME);
  const KLS = createQueueMQ(KALASIN_QUEUE_NAME);

  const app = fastify();

  app.register(authen, { queue: [KK, MSK, ROI, KLS] });

  await app.listen({ port: 3301 }, (err, address) => {

    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }

    console.log(`For the UI with basic auth, open http://${address}:3301/login`);
  });
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});