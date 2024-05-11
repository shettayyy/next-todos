// import { GraphQLRequestContext } from '@apollo/server'

export interface GraphQLContext {
  req: Express.Request;
  res: Express.Response;
}
