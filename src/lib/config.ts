import envSchema from 'env-schema';
import { Type as T, Static } from '@sinclair/typebox';

const schema = T.Object({
  PORT: T.Number(),
  HOST: T.String(),
});

export const config = envSchema<Static<typeof schema>>({
  schema,
  dotenv: { path: '.env.example' },
  env: true,
});
