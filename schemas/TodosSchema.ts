import z from 'zod';

const TodosSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string().nonempty(),
    completed: z.boolean(),
    date: z.string().nonempty().nonoptional(),
  })
);

export default TodosSchema;
