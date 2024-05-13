// import { GraphQLRequestContext } from '@apollo/server'

export interface GraphQLContext {
  req: Express.Request & { user: { id: string } };
  res: Express.Response;
}
