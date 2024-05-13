import { gql } from '../../__generated__';

export const CREATE_TASK = gql(/* GraphQL */ `
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      status {
        label
        value
      }
    }
  }
`);
