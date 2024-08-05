export enum ErrorCode {
  // User Authentication
  UserRegistrationFailed = 'USER_REGISTRATION_FAILED',
  UserLoginFailed = 'USER_LOGIN_FAILED',
  UserLogoutFailed = 'USER_LOGOUT_FAILED',
  Unauthorized = 'UNAUTHORIZED',
  UserNotFound = 'USER_NOT_FOUND',
  NoUserDataToUpdate = 'NO_USER_DATA_TO_UPDATE',

  // Task
  TaskCreationFailed = 'TASK_CREATION_FAILED',
  TaskNotFound = 'TASK_NOT_FOUND',
  TaskUpdateFailed = 'TASK_UPDATE_FAILED',

  // Task Status
  TaskStatusCreationFailed = 'TASK_STATUS_CREATION_FAILED',
  TaskStatusFetchFailed = 'TASK_STATUS_FETCH_FAILED',

  // File Upload
  InvalidFileExtension = 'INVALID_FILE_EXTENSION',
  FailedToGenerateSignedURL = 'FAILED_TO_GENERATE_SIGNED_URL',

  // Unknown Error
  Unknown = 'UNKNOWN',
}
