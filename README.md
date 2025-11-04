# The best todo app in the universe

A simple and modern Todo app built with **Next.js 16**, **TypeScript**, and **JSON Server** as a mock backend.  
This project demonstrates CRUD operations, server/client components, and API integration.
This project also uses the lib **concurrently** in the development environment, which makes it possible to have the fake json-server backend AND the Next app running in the same project (see in the "dev" script in package.json). So you don't need to run the backend in a different terminal. Just run "npm run dev".

## 🚀 Features

- Add, edit, delete, and mark todos as complete
- Persistent data with JSON Server (fake REST API)
- Optimized with Next.js App Router
- Styled using Chakra UI
- Type-safe with TypeScript
- Organized with Context + Reducer for state management

## 🧰 Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Chakra UI](https://chakra-ui.com/)
- [JSON Server](https://github.com/typicode/json-server)
- [Zod](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [ESLint](https://eslint.org/)

## Before passing to the instalation:

Before discuss the instalation, this app was deployed in Vencel and can be accessed via this [link](https://todo-next-app-murex.vercel.app/). The backend was also deployed but in Render, which you can access via this [link](https://fake-backend-wv5q.onrender.com/todos). The data is not so persistent and I don't know why's that, but if you use the app in one single session the app should work as it was supposed to. Let's proceed!

## ⚙️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/todo-app.git
   cd todo-app

   ```

2. Install dependencies:

   ```bash
   npm install

   ```

3. Start the fake backend and the next app (no need to run the backend in another terminal if you are in the dev env):
   ```bash
   npm run dev
   ```

## Next app explanation for users

### Route "/"

This home page renders a list of all the todos in the backend. You have the possibility to add a new todo by clicking the "Add todo" button in the top of the list. By doing that, you open a Dialog component which you can complete the Title and the due date of the Todo. After that you can click the "Save" button and see the new todo appears in the list.
You can also mark a todo as "Done" by clicking in the checkbox in the todo row.

### Route "/[id]"

This page renders the page of a specific todo. In this page you can edit the todos title and due date by clicking in the pencil icon and confirming the edition by clicking in the "check" icon that appears in the place of the pencil icon.
Besides edit, in this page you can delete the todo by clicking in the "X" icon in the left side of the pencil icon. By doing that, an Dialog will open asking you to confirm the Deletion. By clicking in the "Delete" button, you will be redirected to the home page and you can observe that the deleted todo is no longer in the todos list.

## Next app explanation for developers

### Route "/" (Client Component)

This route renders the layout.tsx in the root folder. Then Next.js renders the component in page.tsx as a children of the layout.jsx component. The deal is to list the todos and make basic interactions with them. This page can do todos Creation and Update requests to backend.

1. Before the function returning:

- This page has a useState to control the opening of the Dialog todo creation.
- This page uses React Query to fetch and cache the todos. Not just for fetching but to update the todo also by marking the todo as Done (using useMutation of React Query).
- This page uses React Hook Form to validate and throw fields errors in the creation todo form by using useForm hook.
- it has an onSubmit function to handle the form submission. This is your custom function, the logic YOU want to pass when submitting the form. you have to pass it as a parameter of the handleSubmit function returned by useForm(). this "handleSubmit" function should be called when the form is submitted.

2. Components returned:

- If some error occurs in the Done todo updating or in the fetch todos, the "errorMutation" or "errorQuery" constants will be truthy so a div with the error will be rendered.
- If the getTodos function is not completed, the "isLoading" constant is a truthy value so a Spinner component will be render until the function returns the todos.
- After getTodos is completed, a map function should render the list of todos. Each todo is a Box component and inside it we have a TodoTitle component and a Checkbox component, this last is a Chakra UI component.
- The TodoTitle is a component which is actualy a Link component to the page of the specific todo. This component carries the todo info as object passed by props in the mother component. Based on that info, it renders the title and the due date of that component. If you click in TodoTitle, you will be redirected to the specific todo page ("/[id]" route).
- You can also mark the todo as Done by clicking in the checkbox. This will change the "completed" key of the todo and call the updateTodo function. This updateTodo calls a PUT request passing the todos id as a parameter of the URL request and the todo object as the body of the request. This must be done in a server function because the "/[id]" pages are cached in the server giving to the "force-cache" key in the fetch request so we have to call the "updateTag" next function to revalidate the tag in the server.
- You can create a new Todo by clicking in the "Add Todo" Button. This action should change the open useState to open the Dialog component. Inside the Dialog component you should see a form which the Fields components are bounded to the useForm from React Hook Form. If the fields does not follow the Zod validation, the invalidation message setted in the TodoSchema.ts should be rendered in the bottom of the field. After clicking in the "Save" button, the mutate function will be called to make the POST request to the backend AND update the React Query "todos" tag. By doing this, you have an updated todo list.
- If the titles todo text is longer than the max width, an animation happens when you mouse over the todos title.

### Route "/[id]" (Client Component)

This route renders the page.tsx in the [id] folder. The deal with this page is to see the info of a specific todo and make Delete and Update requests to backend. You see a pencil icon which permits to edit the Todo info. You should also see a "X" icon which allow you to delete the Todo.

1. Before the function returning:

- This component use the useParams hook to get the id from the URL and use it in the GET request to the backend and get the object of the specific Todo.
- This component use the useState hook to hold the fetched Todo object.
- This component use the useState hook to hold the editMode boolean state. This state is what control the edition of the Todo data. If false, no Input Chakra UI components appears, just texts renderind the Todo data. If true, the texts turns into Inputs letting you to edit the data.
- This component use the useColorMode hook to get the color theme of Chakra UI. It is needed because the Icons of pencil and "checked" does not change its colors, so the color change must to be coded manually.
- This component use the useQueryClient hook to revalidate the "todos" tag of the React Query in the Home page. This must be done because when update or delete a Todo, the Home page should render the updated data, so it needs to be revalidated.
- This component use the useRouter hook to redirect the user to the home page when the Todo is deleted.
- This component use the useEffect hook to get the Todo info and store it in the todo state.

2. Components returned:

- Lets jump the Flex and Box components.
- You can see the Heading Chakra UI component that renders the Todo title if the editMode is false and a text Input if the the editMode state is true.
- You can see the p tag that renders the Todo due date if the editMode is false and a React Datepicker if the the editMode state is true.
- After that you can see a Close Icon that allow you to delete the Todo. If you click it, the Dialog Chakra UI component will open. In this Dialog you can Cancel or click in Delete button. If you Delete, the deleteTodo function will be called. This function delete
- You can also find the Pencil Icon. If you click it, you make the editMode true and it is possible to edit the title and the due date. After changing these fields, you can click in the "check" Icon that was rendered in the place of the pencil to confirm the changes.
- You can also click in the "Back to the Home page" to return to the home page.

### \_api folder (Server Functions)

This folder contains the files config.ts, getTodos.ts and todo.ts.

1. config.ts:
   Just hold the URL backend to make the requests.

2. getTodos.ts:
   Just a function to fetch all the Todos from the backend.

3. todo.ts
   Functions to make CRUD operations for Todos. The updateTodo, deleteTodo and createTodo calls the updateTag() function to revalidate the URL in the next cache.

### schema folder

This folder contains the zod rules to validate forms and to validate the responses from the backend.

### types folder

This folder contains the types used in the app. Zod infers are used to infer the type based on the schemas created.

### \_utils folder

This folder contains the functions formatISODate, which return to us the date formated as YYYY/MM/DD based on a string passed as parameter (this string should be in the format YYYY-MM-DD), and the function formatDateToISO, which return to us a date string in the format YYYY-MM-DD based on a date passed as a parameter.
