import { gql } from '../../__generated__';

export const GET_TASK_STATUSES = gql(/* GraphQL */ `
  query GetTaskStatuses {
    taskStatuses {
      value
      label
    }
  }
`);
