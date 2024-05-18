import { gql } from '../../__generated__';

export const CREATE_TASK = gql(/* GraphQL */ `
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
    }
  }
`);

export const UPDATE_TASK = gql(/* GraphQL */ `
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
    }
  }
`);

export const DELETE_TASK = gql(/* GraphQL */ `
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`);
