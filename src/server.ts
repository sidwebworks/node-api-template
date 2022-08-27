import fastify from 'fastify';
import { config } from './lib/config';
import handleGracefulShutdown from './lib/graceful-shutdown';

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
});

server.register(import('./app'));

const graceful = handleGracefulShutdown({ delay: 500 }, async ({ err }) => {
  if (err) {
    server.log.error(err);
  }
  await server.close();
});

server.addHook('onClose', async (_instance, done) => {
  graceful.uninstall();
  done();
});

server.listen({ port: config.PORT, host: config.HOST }, (err: any) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
