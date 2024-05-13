import type { QueryResolvers } from './../../../types.generated';
export const taskStatuses: NonNullable<QueryResolvers['taskStatuses']> = async (
  _parent,
  _arg,
  _ctx
) => {
  return [
    {
      value: '1',
      label: 'To Do',
    },
    {
      value: '2',
      label: 'In Progress',
    },
    {
      value: '3',
      label: 'Done',
    },
  ];
};
