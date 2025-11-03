import z from 'zod';

const TodoSchema = z.object({
  id: z.number({ message: 'id has to be a number' }).optional(),
  title: z
    .string({ message: 'Title has to be a string' })
    .nonempty({ message: 'Must title your Todo' }),
  completed: z.boolean({ message: 'Completed has to be a boolean' }),
  date: z
    .string({ message: 'Date has to be a string' })
    .nonempty({ message: 'Date has to be filled' })
    .nonoptional({ message: 'Date has to be filled' }),
});

export default TodoSchema;
