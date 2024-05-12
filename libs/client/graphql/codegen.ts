import { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';

// Provide environment variables from .env file in development
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: 'libs/client/graphql/.env' });
}

const config: CodegenConfig = {
  schema: process.env.VITE_API_URL,
  documents: ['libs/client/graphql/src/lib/**/*.{ts,tsx}'],
  generates: {
    'libs/client/graphql/src/lib/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  require: ['dotenv/config'],
};

export default config;
