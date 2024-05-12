import {
  ApolloServer,
  ApolloServerOptionsWithTypeDefs,
  BaseContext,
} from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import { Application, json, urlencoded } from 'express';
import helmet from 'helmet';
import { Server } from 'http';
import mongoose from 'mongoose';

import { env } from '../environment/env';
import { DocumentNode } from 'graphql';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { GraphQLContext } from '@task-master/server/graphql';

export async function initializeMiddlewares(
  app: Application,
  httpServer: Server,
  {
    typeDefs,
    resolvers,
  }: {
    typeDefs: DocumentNode;
    resolvers: ApolloServerOptionsWithTypeDefs<BaseContext>['resolvers'];
  }
) {
  // Set the application to trust the reverse proxy
  app.set('trust proxy', true);

  // General middlewares
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(
    helmet({
      crossOriginEmbedderPolicy: env.isProduction,
      contentSecurityPolicy: env.isProduction ? undefined : false,
    })
  );
  app.use(
    cors({
      // allow any origin in development
      origin: [env.CORS_ORIGIN],
      credentials: true,
    })
  );

  // Passport middleware
  app.use(
    session({
      secret: env.PASSPORT_SECRET,
      resave: false,
      saveUninitialized: false,
      // Use mongo store for session storage using the mongoose connection
      store: new MongoStore({
        mongoUrl: env.MONGODB_URI,
        // https://github.com/jdesboeufs/connect-mongo?tab=readme-ov-file#lazy-session-update
        touchAfter: 24 * 3600, // time period in seconds
      }),
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Return a welcome message to the root path
  app.get('/', (_, res) => {
    res.json({
      message: 'Welcome to the GraphQL API. Please use the /graphql endpoint.',
    });
  });

  ////////////////////////////////////////
  // Apollo Server
  ////////////////////////////////////////
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    // https://www.apollographql.com/docs/apollo-server/migration#appropriate-400-status-codes
    status400ForVariableCoercionErrors: true,
    plugins: [
      // For shutting down the HTTP server gracefully
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginCacheControl({
        // Cache everything for 1 second by default.
        defaultMaxAge: 1,
      }),
    ],
  });

  await server.start();
  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: false,
  });

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async (context) => context,
    })
  );
}
