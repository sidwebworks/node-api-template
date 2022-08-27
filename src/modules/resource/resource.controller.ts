import { RouteHandler } from 'fastify';

export const healthcheck: RouteHandler = (request, reply) => {
  reply.statusCode = 200;
  reply.send(`Yo yo yo!! ${request.ip}`);
};
