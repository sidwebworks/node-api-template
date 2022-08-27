import fp from 'fastify-plugin';
import * as controllers from './resource.controller';

const routes = fp(async (instance) => {
  instance.get('/', controllers.healthcheck);
});

export default routes;
