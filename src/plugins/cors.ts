import cors, { FastifyCorsOptions } from '@fastify/cors';
import fp from 'fastify-plugin';

export default fp<FastifyCorsOptions>(async (fastify) => {
  await fastify.register(cors);
});
