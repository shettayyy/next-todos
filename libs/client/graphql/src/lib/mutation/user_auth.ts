import { gql } from '../__generated__';

export const LOGIN = gql(/* GraphQL */ `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      firstName
      id
      lastName
    }
  }
`);

export const LOGOUT = gql(/* GraphQL */ `
  mutation Logout {
    logout {
      email
    }
  }
`);

export const REGISTER = gql(/* GraphQL */ `
  mutation Register($input: CreateUserInput!) {
    createUser(input: $input) {
      email
      firstName
      id
      lastName
    }
  }
`);
