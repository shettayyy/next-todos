import type { CodegenConfig } from '@graphql-codegen/cli';
import { defineConfig } from '@eddeee888/gcg-typescript-resolver-files';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'libs/server/graphql/src/lib/schema/**/schema.graphql',
  generates: {
    'libs/server/graphql/src/lib/schema': defineConfig({
      tsConfigFilePath: 'libs/server/graphql/tsconfig.lib.json',
    }),
  },
};

export default config;
