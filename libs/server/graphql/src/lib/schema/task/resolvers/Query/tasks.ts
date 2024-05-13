import type { QueryResolvers } from './../../../types.generated';
export const tasks: NonNullable<QueryResolvers['tasks']> = async (
  _parent,
  _arg,
  _ctx
) => {
  /* Implement Query.tasks resolver logic here */
  return {
    items: [],
    metadata: {
      pagination: {},
    },
  };
};
