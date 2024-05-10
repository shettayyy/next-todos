import express, { Express } from 'express';
import http from 'http';

import { env } from '@task-master/server/config';
import { initializeMiddlewares } from '@task-master/server/config';
import { resolvers, typeDefs } from '@task-master/server/graphql';

const app: Express = express();
const httpServer = http.createServer(app);

const startServer = async () => {
  try {
    await initializeMiddlewares(app, httpServer, { resolvers, typeDefs });

    const server = httpServer.listen(env.PORT, () => {
      const { NODE_ENV, HOST, PORT } = env;
      console.info(
        `Server (${NODE_ENV}) running on port: http://${HOST}:${PORT}`
      );
    });

    // Graceful shutdown
    const onCloseSignal = () => {
      console.info('sigint received, shutting down');
      server.close(() => {
        console.info('server closed');
        process.exit();
      });
      setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
    };

    process.on('SIGINT', onCloseSignal);
    process.on('SIGTERM', onCloseSignal);
  } catch (error) {
    console.error('Error initializing middlewares', error);
  }
};

startServer();
