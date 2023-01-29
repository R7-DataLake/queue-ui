const { FastifyAdapter, createBullBoard, BullMQAdapter } = require('@bull-board/fastify');
const pointOfView = require('@fastify/view');
const path = require('path');

module.exports.authen = function authen(fastify, { queue }, next) {

  const SUPER_SECRET_KEY = process.env.R7PLATFORM_QUEUEUI_SUPER_SECRET_KEY || 'jflvmHJeuPDyf6DXX2RN3CbdPkbzj2DY';
  const SECRET_KEY = process.env.R7PLATFORM_QUEUEUI_SECRET_KEY || 'jflvmHJeuPDyf6DXX2RN3CbdPkbzj2DY';


  fastify.register(require('@fastify/cookie'), {
    secret: SECRET_KEY,
  });

  fastify.register(require('@fastify/jwt'), {
    secret: SUPER_SECRET_KEY,
    cookie: {
      cookieName: 'token',
    },
  });

  fastify.after(() => {
    const serverAdapter = new FastifyAdapter();

    let queues = [];
    queue.forEach(q => {
      queues.push(new BullMQAdapter(q));
    });

    createBullBoard({
      queues: queues,
      serverAdapter,
      options: {
        uiConfig: {
          boardTitle: 'R7 Queues',
        },
      }
    });

    serverAdapter.setBasePath('/ui');
    fastify.register(serverAdapter.registerPlugin(), { prefix: '/ui' });

    fastify.register(pointOfView, {
      engine: {
        ejs: require('ejs'),
      },
      root: path.resolve('./views'),
    });

    fastify.route({
      method: 'GET',
      url: '/',
      handler: (req, reply) => {
        reply.redirect('/ui');
      },
    });

    fastify.route({
      method: 'GET',
      url: '/login',
      handler: (req, reply) => {
        reply.view('login.ejs');
      },
    });

    fastify.route({
      method: 'POST',
      url: '/login',
      handler: async (req, reply) => {
        const { username = '', password = '' } = req.body;

        if (username === process.env.R7PLATFORM_QUEUEUI_UI_USERNAME || 'bull' && password === process.env.R7PLATFORM_QUEUEUI_UI_PASSWORD || 'board') {
          const token = await reply.jwtSign({
            name: 'r7admin',
            role: ['admin'],
          });

          reply
            .setCookie('token', token, {
              path: '/',
              secure: false, // send cookie over HTTPS only
              httpOnly: true,
              sameSite: true, // alternative CSRF protection
            })
            .send({ success: true, url: '/ui' });
        } else {
          reply.code(401).send({ error: 'invalid_username_password' });
        }
      },
    });

    fastify.addHook('preHandler', async (request, reply) => {
      if (request.url === '/login') {
        return;
      }

      try {
        await request.jwtVerify();
      } catch (error) {
        // reply.code(401).send({ error: 'Unauthorized' });
        reply.redirect('/login');
      }
    });
  });

  next();
};