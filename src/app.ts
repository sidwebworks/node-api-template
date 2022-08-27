import { join } from 'path';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import { getDirname } from './lib/utils';

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  void fastify.register(AutoLoad, {
    dir: join(getDirname(import.meta.url), 'plugins'),
    options: opts,
  });

  void fastify.register(AutoLoad, {
    dir: join(getDirname(import.meta.url), 'modules'),
    options: opts,
    indexPattern: /.*routes(\.ts|\.mjs)$/,
    maxDepth: 2,
  });
};

export default app;
export { app };
