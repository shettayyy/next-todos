import { gql } from '../../__generated__';

export const UserFragmentDoc = gql(`
  fragment UserItem on User {
    id
    email
    firstName
    lastName
  }
`);
