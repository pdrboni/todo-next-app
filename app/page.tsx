'use client';
import { toaster, Toaster } from '@/components/ui/toaster';
import {
  AbsoluteCenter,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Dialog,
  Field,
  Flex,
  Icon,
  Input,
  Portal,
  Spinner,
} from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { IoMdAdd } from 'react-icons/io';
import { getTodos } from './_api/getTodos';
import { Todos } from '@/types/todos';
import { Todo } from '@/types/todo';
import { useRef, useState } from 'react';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import '@/public/react-datepicker.css';
import { formatDateToISO, formatISODate } from './_utils/dateUtils';
import { createTodo, updateTodo } from './_api/todo';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TodoSchema from '@/schemas/TodoSchema';
import TodoTitle from '@/components/ui/todo-title';

export default function Home() {
  const [open, setOpen] = useState(false);

  const {
    data,
    isLoading,
    refetch: refetchTodos,
    error: errorQuery,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  const {
    mutate,
    isPending,
    error: errorMutation,
  } = useMutation({
    mutationFn: async (data: Todo) => {
      await createTodo(data);
    },
    onSuccess: () => {
      refetchTodos();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    control,
    reset,
  } = useForm<Todo>({
    resolver: zodResolver(TodoSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      completed: false,
      date: '',
    },
  });

  const onSubmit: SubmitHandler<Todo> = async (data: Todo) => {
    try {
      await mutate(data);
      reset();
      setOpen(false);
    } catch (error) {}
  };

  return (
    <div style={{ width: 'fit-content', margin: '0 auto' }}>
      {(errorMutation || errorQuery) && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'rgba(255, 84, 84, 0.5)',
            border: '2px solid red',
          }}
        >
          {errorMutation ? errorMutation.message : errorQuery?.message}
        </div>
      )}
      {!isLoading ? (
        <Dialog.Root
          size={'md'}
          open={open}
          onOpenChange={(details) => setOpen(details.open)}
        >
          <Box
            p="4"
            borderWidth="1px"
            borderColor="border.disabled"
            color="fg.disabled"
            borderRadius="md"
            shadow="md"
            maxHeight="40rem"
            overflow="scroll"
          >
            <Flex align="center" m="2" minW="25rem">
              <Button w="100%" onClick={() => setOpen(true)}>
                Add todo
                <Icon>
                  <IoMdAdd />
                </Icon>
              </Button>
            </Flex>
            <Flex direction="column">
              <Flex
                padding="0 1rem"
                paddingTop="1rem"
                align="center"
                justifyContent="space-between"
                color="grey"
              >
                <span>Title</span>
                <span style={{ paddingLeft: '2rem' }}>Conc. Date</span>
                <span>Done</span>
              </Flex>
              {data?.map((t, i) => (
                <Box
                  key={i}
                  p="4"
                  borderWidth="1px"
                  borderColor="border.disabled"
                  color="fg.disabled"
                  borderRadius="md"
                  shadow="md"
                  m="2"
                  position="relative"
                  _after={
                    t.completed
                      ? {
                          content: '""',
                          position: 'absolute',
                          left: '12px',
                          right: '60px',
                          top: '50%',
                          height: '1px',
                          bg: 'currentColor',
                          transform: 'translateY(-50%)',
                        }
                      : {}
                  }
                >
                  <Flex align="center">
                    <TodoTitle t={{ ...t }} />

                    <Checkbox.Root paddingTop="0.5" checked={t.completed}>
                      <Checkbox.HiddenInput
                        onChange={async (e) => {
                          t.completed = e.target.checked;
                          await updateTodo(t);
                        }}
                      />
                      <Checkbox.Control />
                    </Checkbox.Root>
                  </Flex>
                </Box>
              ))}
            </Flex>
          </Box>

          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>New Todo</Dialog.Title>
                </Dialog.Header>
                <form action="" onSubmit={handleSubmit(onSubmit)}>
                  <Dialog.Body>
                    <Field.Root>
                      <Field.Label>Title</Field.Label>
                      <Input
                        {...register('title')}
                        type="text"
                        placeholder="Set a title"
                      />
                      {errors.title && (
                        <div className="text-red-500">
                          {errors.title.message}
                        </div>
                      )}
                    </Field.Root>
                    <Field.Root paddingTop="1rem">
                      <Field.Label>Conclusion date</Field.Label>
                      <Controller
                        name="date"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            selected={
                              field.value
                                ? new Date(field.value + 'T00:00:00')
                                : null
                            }
                            onChange={(date) => {
                              const formatted = date
                                ? formatDateToISO(date)
                                : '';
                              field.onChange(formatted);
                            }}
                            dateFormat="yyyy-MM-dd"
                            showYearDropdown
                            showMonthDropdown
                            placeholderText="Select a conclusion date"
                          />
                        )}
                      />
                      {errors.date && (
                        <div className="text-red-500">
                          {errors.date.message}
                        </div>
                      )}
                    </Field.Root>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.preventDefault();
                          reset();
                        }}
                      >
                        Cancel
                      </Button>
                    </Dialog.ActionTrigger>
                    <Button type="submit">
                      {isSubmitting ? <Spinner /> : 'Save'}
                    </Button>
                  </Dialog.Footer>
                </form>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" onClick={() => reset()} />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      ) : (
        <Spinner size="xl" />
      )}
    </div>
  );
}
