import { gql } from '../../__generated__';

export const GET_USER = gql(/* GraphQL */ `
  query GetUser {
    user {
      ...UserItem
    }
  }
`);
