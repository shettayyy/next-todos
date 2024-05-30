import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { Mock, vi } from 'vitest';
import { useToast } from '@task-master/client/context';
import { Tasks } from './tasks';
import {
  CREATE_TASK,
  DELETE_TASK,
  GET_TASKS,
  GET_TASK_STATUSES,
  SortDirection,
  SortField,
  UPDATE_TASK,
} from '@task-master/client/graphql';

vi.mock('@task-master/client/context');

const mockTaskStatuses = [
  {
    id: '6642596955c5a701cafe6b24',
    status: 'To Do',
    bgColor: '#DBE8FE',
    textColor: '#1E40AF',
  },
  {
    id: '6642597155c5a701cafe6b30',
    status: 'In Progress',
    bgColor: '#FEF9C3',
    textColor: '#854D0E',
  },
  {
    id: '6642597e55c5a701cafe6b3e',
    status: 'Done',
    bgColor: '#DCFCE7',
    textColor: '#166534',
  },
];

const mockTasks = [
  {
    id: '1',
    title: 'Task 1',
    description: 'This is task 1',
    status: mockTaskStatuses[0].id,
    taskStatus: mockTaskStatuses[0],
    createdAt: '1630300800000',
    updatedAt: '1630300800000',
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'This is task 2',
    status: mockTaskStatuses[1].id,
    taskStatus: mockTaskStatuses[1],
    createdAt: '1630300800000',
    updatedAt: '1630300800000',
  },
];

const mockCreateTask = {
  id: '2',
  title: 'New Task',
  description: 'This is a new task',
  status: mockTaskStatuses[0].id,
  taskStatus: mockTaskStatuses[0],
  createdAt: '1630300800000',
  updatedAt: '1630300800000',
};

const mocks = [
  {
    request: {
      query: GET_TASKS,
      variables: {
        input: {
          page: 1,
          limit: 40,
          filter: {
            search: '',
          },
          sort: {
            field: SortField.UpdatedAt,
            dir: SortDirection.Desc,
          },
        },
      },
    },
    result: {
      data: {
        tasks: {
          result: [...mockTasks],
          metadata: {
            pagination: {
              currentPage: 1,
              nextPage: 2,
              prevPage: null,
              total: 2,
            },
          },
        },
      },
    },
  },
  {
    request: {
      query: GET_TASK_STATUSES,
    },
    result: {
      data: {
        taskStatuses: mockTaskStatuses,
      },
    },
  },
];

describe('Tasks', () => {
  beforeEach(() => {
    (useToast as Mock).mockImplementation(() => ({
      showToast: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const TaskComponent = (props: {
    allMocks: readonly MockedResponse[] | undefined;
  }) => (
    <MockedProvider mocks={props.allMocks} addTypename={false}>
      <MemoryRouter>
        <Tasks />
      </MemoryRouter>
    </MockedProvider>
  );

  it('renders the Tasks component', async () => {
    render(<TaskComponent allMocks={mocks} />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Tasks 📋'
      );
      expect(
        screen.getByRole('button', { name: 'Add Task' })
      ).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(mockTasks.length);
    });
  });

  it('opens the add task modal when the "Add Task" button is clicked', async () => {
    render(<TaskComponent allMocks={mocks} />);

    await waitFor(() => {
      const addTaskButton = screen.getByRole('button', { name: 'Add Task' });
      userEvent.click(addTaskButton);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('creates a new task', async () => {
    const createTaskMock = {
      request: {
        query: CREATE_TASK,
        variables: {
          input: {
            title: mockCreateTask.title,
            description: mockCreateTask.description,
            status: mockCreateTask.status,
          },
        },
      },
      result: {
        data: {
          createTask: {
            id: mockCreateTask.id,
            title: mockCreateTask.title,
            description: mockCreateTask.description,
            status: mockCreateTask.status,
          },
        },
      },
    };

    const updatedTasksMock = {
      ...mocks[0],
      result: {
        data: {
          tasks: {
            result: [...mockTasks, mockCreateTask],
            metadata: {
              pagination: {
                currentPage: 1,
                nextPage: 2,
                prevPage: null,
                total: 3,
              },
            },
          },
        },
      },
    };

    render(
      <TaskComponent allMocks={[...mocks, createTaskMock, updatedTasksMock]} />
    );

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const addTaskButton = screen.getByRole('button', { name: 'Add Task' });
    await userEvent.click(addTaskButton);

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');

    await userEvent.type(
      titleInput,
      createTaskMock.request.variables.input.title
    );
    await userEvent.type(
      descriptionInput,
      createTaskMock.request.variables.input.description
    );

    const submitButton = screen.getByRole('button', { name: 'Add Task' });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(
        mockTasks.length + 1
      );
    });
  });

  it('deletes a task', async () => {
    const deleteTaskMock = {
      request: {
        query: DELETE_TASK,
        variables: {
          id: mockTasks[0].id,
        },
      },
      result: {
        data: {
          deleteTask: {
            id: mockTasks[0].id,
          },
        },
      },
    };

    const updatedTasksMock = {
      ...mocks[0],
      result: {
        data: {
          tasks: {
            result: [mockTasks[1]],
            metadata: {
              pagination: {
                currentPage: 1,
                nextPage: 2,
                prevPage: null,
                total: 1,
              },
            },
          },
        },
      },
    };

    render(
      <TaskComponent allMocks={[...mocks, deleteTaskMock, updatedTasksMock]} />
    );

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const menuButton = screen.queryAllByTestId('task-list-menu-btn')[0];
    await userEvent.click(menuButton);

    const deleteButton = screen.getByTestId('delete-task');
    await userEvent.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: 'Delete' });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
    });
  });

  it('updates a task status', async () => {
    const updateTaskMock = {
      request: {
        query: UPDATE_TASK,
        variables: {
          id: mockTasks[0].id,
          input: {
            status: mockTaskStatuses[1].id,
          },
        },
      },
      result: {
        data: {
          updateTask: {
            id: mockTasks[0].id,
          },
        },
      },
    };

    const updatedTasksMock = {
      ...mocks[0],
      result: {
        data: {
          tasks: {
            result: [
              {
                ...mockTasks[0],
                status: mockTaskStatuses[1].id,
                taskStatus: mockTaskStatuses[1],
              },
              mockTasks[1],
            ],
            metadata: {
              pagination: {
                currentPage: 1,
                nextPage: 2,
                prevPage: null,
                total: 2,
              },
            },
          },
        },
      },
    };

    render(
      <TaskComponent allMocks={[...mocks, updateTaskMock, updatedTasksMock]} />
    );

    await waitFor(() => {
      const taskItem1 = screen.getAllByRole('listitem')[0];

      expect(taskItem1).toHaveTextContent('To Do');
    });

    const menuButton = screen.queryAllByTestId('task-list-menu-btn')[0];
    await userEvent.click(menuButton);

    const inProgressButton = screen.getByTestId(
      'task-status-menu-item-In-Progress'
    );
    await userEvent.click(inProgressButton);

    await waitFor(() => {
      expect(screen.getAllByRole('listitem')[0]).toHaveTextContent(
        'In Progress'
      );
    });
  });
});
