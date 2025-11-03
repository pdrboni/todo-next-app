import TodoSchema from '@/schemas/TodoSchema';
import z from 'zod';

export type Todo = z.infer<typeof TodoSchema>;
