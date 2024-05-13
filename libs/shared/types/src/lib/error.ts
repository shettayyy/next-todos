export enum ErrorCode {
  // User Authentication
  UserRegistrationFailed = 'USER_REGISTRATION_FAILED',
  UserLoginFailed = 'USER_LOGIN_FAILED',
  UserLogoutFailed = 'USER_LOGOUT_FAILED',
  Unauthorized = 'UNAUTHORIZED',
  UserNotFound = 'USER_NOT_FOUND',

  // Task
  TaskCreationFailed = 'TASK_CREATION_FAILED',
  TaskNotFound = 'TASK_NOT_FOUND',
  TaskUpdateFailed = 'TASK_UPDATE_FAILED',

  // Task Status
  TaskStatusCreationFailed = 'TASK_STATUS_CREATION_FAILED',
  TaskStatusFetchFailed = 'TASK_STATUS_FETCH_FAILED',
}
