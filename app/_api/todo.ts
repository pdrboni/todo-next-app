'use server';

import { Todo } from '@/types/todo';
import { updateTag } from 'next/cache';
import TodoSchema from '@/schemas/TodoSchema';
import { API_URL_BACKEND } from './config';

export async function updateTodo(data: Todo) {
  try {
    await fetch(`${API_URL_BACKEND}/todos/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    updateTag(`todo${data.id}`);
  } catch (error) {
    throw new Error(`Failed to update todo ${error}`);
  }
}

export const getTodo = async (id: string): Promise<Todo> => {
  const res = await fetch(`${API_URL_BACKEND}/todos/${id}`, {
    cache: 'force-cache',
    next: { tags: [`todo${id}`] },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch todo ${id}`);
  }
  const data = await res.json();
  return TodoSchema.parse(data);
};

export const deleteTodo = async (id: number | undefined) => {
  try {
    await fetch(`${API_URL_BACKEND}/todos/${id}`, {
      method: 'DELETE',
    });
    updateTag(`todo${id}`);
  } catch (error) {
    throw new Error(`Failed to delete todo ${error}`);
  }
};

export const createTodo = async (data: Todo) => {
  try {
    const res = await fetch(`${API_URL_BACKEND}/todos`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const resData = await res.json();
    updateTag(`todo${resData.id}`);

    return resData as Promise<Todo>;
  } catch (error) {
    throw new Error(`Failed to create todo ${error}`);
  }
};
