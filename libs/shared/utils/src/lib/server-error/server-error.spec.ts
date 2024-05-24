import { handleGraphQLError } from './server-error';

describe('handleGraphQLError', () => {
  it('should throw the error if it is a GraphQLError', () => {
    const error = new Error('Test error');
    expect(() => handleGraphQLError(error)).toThrowError();
  });

  it('should throw a GraphQLError if the error is an instance of Error', () => {
    const error = new Error('Test error');
    expect(() => handleGraphQLError(error)).toThrowError();
  });

  it('should throw a GraphQLError with the provided code', () => {
    const error = new Error('Test error');
    expect(() => handleGraphQLError(error, 'TEST_CODE')).toThrowError();
  });

  it('should throw a GraphQLError with the default code', () => {
    const error = new Error('Test error');
    expect(() => handleGraphQLError(error)).toThrowError();
  });
});
