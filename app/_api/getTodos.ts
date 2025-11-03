import TodosSchema from '@/schemas/TodosSchema';
import { Todos } from '@/types/todos';
import { API_URL_BACKEND } from './config';

export const getTodos = async (): Promise<Todos> => {
  const res = await fetch(`${API_URL_BACKEND}/todos`);
  const data = await res.json();

  return TodosSchema.parse(data);
};
