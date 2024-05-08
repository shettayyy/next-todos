export const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
  Mutation: {
    add(): string {
      return 'add';
    },
  },
};
