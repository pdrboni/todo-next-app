import TodosSchema from '@/schemas/TodosSchema';
import z from 'zod';

export type Todos = z.infer<typeof TodosSchema>;
