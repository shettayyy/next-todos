import { gql } from '../../__generated__';

export const GET_TASK_STATUSES = gql(/* GraphQL */ `
  query GetTaskStatuses {
    taskStatuses {
      id
      status
      bgColor
      textColor
    }
  }
`);

export const GET_TASKS = gql(/* GraphQL */ `
  query GetTasks($input: TaskParams) {
    tasks(input: $input) {
      result {
        id
        title
        description
        status
        taskStatus {
          id
          status
          bgColor
          textColor
        }
        createdAt
      }
      metadata {
        pagination {
          currentPage
          nextPage
          prevPage
          total
        }
      }
    }
  }
`);
