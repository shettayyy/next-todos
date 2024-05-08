import 'dotenv/config';

import { cleanEnv, host, port, str } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production'] }),
  CORS_ORIGIN: str(),
  MONGODB_URI: str(),
  AWS_ACCESS_KEY_ID: str(),
  AWS_SECRET_ACCESS_KEY: str(),
  AWS_REGION: str(),
  S3_BUCKET_NAME: str(),
  HOST: host(),
  PORT: port(),
});
