'use client';

import { redirect, useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { deleteTodo, getTodo, updateTodo } from '../_api/todo';
import { Todo } from '@/types/todo';
import Link from 'next/link';
import {
  AbsoluteCenter,
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  Heading,
  Input,
  Portal,
  Spinner,
} from '@chakra-ui/react';
import { IoMdClose } from 'react-icons/io';
import { MdOutlineEdit } from 'react-icons/md';
import { useColorMode } from '@/components/ui/color-mode';
import { formatDateToISO, formatISODate } from '../_utils/dateUtils';
import { FaCheck } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import '@/public/react-datepicker.css';
import { useQueryClient } from '@tanstack/react-query';

function TodoPage() {
  const params = useParams<{ id: string }>();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const { colorMode } = useColorMode();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchTodo() {
      if (!params.id) return;
      const data = await getTodo(params.id);
      setTodo(data);
    }

    fetchTodo();
  }, [params.id]);

  return (
    <div>
      {todo ? (
        <>
          <Dialog.Root>
            <Flex direction="column" align="center">
              <Box
                marginTop="4"
                minWidth="20vw"
                p="4"
                borderWidth="1px"
                borderColor="border.disabled"
                color="fg.disabled"
                borderRadius="md"
                shadow="md"
              >
                <Flex direction="column" align="center" p="2rem">
                  <Heading as="h1" size="6xl" maxWidth="50vw">
                    {editMode ? (
                      <Input
                        value={todo.title}
                        onChange={(e) =>
                          setTodo({ ...todo, title: e.target.value })
                        }
                        type="text"
                        size="2xl"
                      />
                    ) : (
                      todo.title
                    )}
                  </Heading>
                  {editMode ? (
                    <div style={{ paddingTop: '1rem' }}>
                      <DatePicker
                        selected={new Date(todo.date + 'T00:00:00')}
                        onChange={(date) => {
                          if (date) {
                            setTodo({ ...todo, date: formatDateToISO(date) });
                          }
                        }}
                        dateFormat="yyyy-MM-dd"
                        showYearDropdown
                        showMonthDropdown
                      />
                    </div>
                  ) : (
                    <p style={{ paddingTop: '1rem' }}>
                      {formatISODate(todo.date)}
                    </p>
                  )}
                  <p style={{ paddingTop: '1rem' }}>
                    {todo.completed ? 'Done ✅' : 'Not done ❌'}
                  </p>
                </Flex>
              </Box>
              <Flex justify="between" paddingTop="1rem">
                <Dialog.Trigger asChild>
                  <Button background="none" color="red" title="Delete">
                    <IoMdClose />
                  </Button>
                </Dialog.Trigger>
                <Button
                  background="none"
                  color={colorMode === 'dark' ? 'white' : 'black'}
                  title={editMode ? 'Confirm' : 'Edit'}
                  onClick={async () => {
                    setEditMode(!editMode);

                    if (editMode) {
                      await updateTodo(todo);
                      queryClient.invalidateQueries({ queryKey: ['todos'] });
                    }
                  }}
                >
                  {editMode ? <FaCheck /> : <MdOutlineEdit />}
                </Button>
              </Flex>
              <Link
                style={{ marginTop: '2rem' }}
                href={`http://localhost:3000/`}
              >
                Back to Home page
              </Link>
            </Flex>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Delete Todo</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <p>Do you really want to delete the todo {todo.title}?</p>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </Dialog.ActionTrigger>
                    <Button
                      onClick={async () => {
                        await deleteTodo(todo.id);
                        queryClient.invalidateQueries({ queryKey: ['todos'] });
                        router.push('/');
                      }}
                    >
                      Delete
                    </Button>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </>
      ) : (
        <AbsoluteCenter>
          <Spinner size="xl" />
        </AbsoluteCenter>
      )}
    </div>
  );
}

export default TodoPage;
