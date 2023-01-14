const { Queue: QueueMQ, Worker, QueueScheduler } = require('bullmq');
const fastify = require('fastify');
const { authen } = require('./auth');

require('dotenv').config('./config.conf')

// const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t * 1000));

const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  username: process.env.REDIS_USERNAME || 'admin',
  password: process.env.REDIS_PASSWORD || 'admin',
  tls: false,
};

const KK_QUEUE_NAME = process.env.QUEUE_NAME || 'KHONKAEN';
const MSK_QUEUE_NAME = process.env.QUEUE_NAME || 'MAHASARAKHAM';
const ROIET_QUEUE_NAME = process.env.QUEUE_NAME || 'ROIET';
const KALASIN_QUEUE_NAME = process.env.QUEUE_NAME || 'KALASIN';

const createQueueMQ = (name) => new QueueMQ(name, { connection: redisOptions });

const run = async () => {
  const KK = createQueueMQ(KK_QUEUE_NAME);
  const MSK = createQueueMQ(MSK_QUEUE_NAME);
  const ROI = createQueueMQ(ROIET_QUEUE_NAME);
  const KLS = createQueueMQ(KALASIN_QUEUE_NAME);

  const app = fastify();

  app.register(authen, { queue: [KK, MSK, ROI, KLS] });

  await app.listen({ port: 3301 });
  // eslint-disable-next-line no-console
  console.log('Running on 3301...');
  console.log('For the UI with basic auth, open http://localhost:3301/login');
};

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});