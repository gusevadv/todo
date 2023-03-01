'use client'
import { useState, useEffect, useReducer, useCallback } from 'react'
import { Todo } from '@/types'
import { TodoService } from '@/services/TodoService'
import TodoInMemoryService from '@/services/TodoInMemoryService'
import TodoLocalStorageService from '@/services/TodoLocalStorageService'

// const storage = localStorage
// const todoService: TodoService = new TodoLocalStorageService(storage)

const todoService: TodoService = new TodoInMemoryService()

function filterTodos(todos: Todo[], completed: boolean): Todo[] {
  const filteredTodos = completed ? todos.filter(todo => todo.checked === true) : todos
  return filteredTodos
}

function getCounter(todos: Todo[]): string {
  const allItem = todos.length
  const trueCheckedItem = todos.filter((todo) => todo.checked === true)
  return trueCheckedItem.length + '/' + allItem
}

type State = {
  loading: boolean
  addLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
  todos: Todo[]
  filteredTodos: Todo[]
  completed: boolean
  counter: string
}

type Action =
  | { type: 'GET_TODOS' }
  | { type: 'GET_TODOS_COMPLETE', payload: { todos: Todo[] } }
  | { type: 'GET_TODOS_ERROR', payload: { message: string } }

  | { type: 'ADD_TODO' }
  | { type: 'ADD_TODO_COMPLETE', payload: { todo: Todo } }
  | { type: 'ADD_TODO_ERROR', payload: { message: string } }

  | { type: 'UPDATE_TODO', payload: { todo: Todo } }
  | { type: 'UPDATE_TODO_COMPLETE', payload: { todo: Todo } }
  | { type: 'UPDATE_TODO_ERROR', payload: { message: string } }

  | { type: 'DELETE_TODO', payload: { todo: Todo } }
  | { type: 'DELETE_TODO_COMPLETE', payload: { todo: Todo }}
  | { type: 'DELETE_TODO_ERROR', payload: { message: string } }

  | { type: 'FILTER_TODOS', payload: { completed: boolean } }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'GET_TODOS': {
      return {
        ...state,
        loading: true
      }
    }
    case 'GET_TODOS_COMPLETE': {
      const newTodos = action.payload.todos
      const filteredTodos = filterTodos(newTodos, state.completed)
      const counter = getCounter(newTodos)
      return {
        ...state,
        loading: false,
        todos: newTodos,
        filteredTodos,
        counter
      }
    }
    case 'GET_TODOS_ERROR': {
      const message = action.payload.message
      // TODO: Handle error message
      console.log(message)
      return state
    }
    case 'ADD_TODO': {
      return {
        ...state,
        addLoading: true
      }
    }
    case 'ADD_TODO_COMPLETE': {
      const newTodo = action.payload.todo
      const newTodos = [...state.todos, newTodo]
      const filteredTodos = filterTodos(newTodos, state.completed)
      const counter = getCounter(newTodos)
      return {
        ...state,
        addLoading: false,
        todos: newTodos,
        filteredTodos,
        counter
      }
    }
    case 'ADD_TODO_ERROR': {
      const message = action.payload.message
      // TODO: Handle error message
      console.log(message)
      return state
    }
    case 'UPDATE_TODO': {
      return {
        ...state,
        updateLoading: true
      }
    }
    case 'UPDATE_TODO_COMPLETE': {
      const updatedTodo = action.payload.todo
      const updatedIndex = state.todos.findIndex((todo) => todo.id === updatedTodo.id)
      const updatedTodos = [...state.todos]
      updatedTodos.splice(updatedIndex, 1, updatedTodo)
      const filteredTodos = filterTodos(updatedTodos, state.completed)
      const counter = getCounter(updatedTodos)
      return {
        ...state,
        todos: updatedTodos,
        updateLoading: false,
        filteredTodos,
        counter
      }
    }
    case 'UPDATE_TODO_ERROR': {
      const message = action.payload.message
      // TODO: Handle error message
      console.log(message)
      return state
    }
    case 'DELETE_TODO': {
      return {
        ...state,
        deleteLoading: true
      }
    }
    case 'DELETE_TODO_COMPLETE': {
      const deletedTodo = action.payload.todo
      const deleteIndex = state.todos.findIndex((todo) => todo.id === deletedTodo.id)
      const updatedTodos = [...state.todos]
      updatedTodos.splice(deleteIndex, 1)
      const filteredTodos = filterTodos(updatedTodos, state.completed)
      const counter = getCounter(updatedTodos)
      return {
        ...state,
        todos: updatedTodos,
        deleteLoading: false,
        filteredTodos,
        counter
      }
    }
    case 'DELETE_TODO_ERROR': {
      const message = action.payload.message
      // TODO: Handle error message
      console.log(message)
      return state
    }
    case 'FILTER_TODOS': {
      const completed = action.payload.completed
      const filteredTodos = filterTodos(state.todos, completed)
      const counter = getCounter(state.todos)
      return {
        ...state,
        filteredTodos,
        completed,
        counter
      }
    }
    default:
      return state
  }
}

function getInitialState(todos: Todo[]): State {
  return {
    loading: false,
    addLoading: false,
    updateLoading: false,
    deleteLoading: false,
    todos,
    filteredTodos: filterTodos(todos, false),
    completed: false,
    counter: getCounter(todos)

  }
}

export default function Page() {
  const [state, dispatch] = useReducer(reducer, getInitialState([]))

  useEffect(() => {
    async function getTodos() {
      dispatch({ type: 'GET_TODOS' })
      const todos = await todoService.getTodos()
      dispatch({ type: 'GET_TODOS_COMPLETE', payload: { todos }})
    }
    getTodos()
  }, [])

  const handleAddItem = async () => {
    dispatch({ type: 'ADD_TODO' })
    const todo = await todoService.createTodo()
    dispatch({ type: 'ADD_TODO_COMPLETE', payload: { todo }})
  }

  const handleUpdateItem = async (todo: Todo) => {
    dispatch({ type: 'UPDATE_TODO', payload: { todo }})
    const updatedTodo = await todoService.updateTodo(todo)
    dispatch({ type: 'UPDATE_TODO_COMPLETE', payload: { todo }})
  }

  const handleDeleteItem = async (todo: Todo) => {
    dispatch({ type: 'DELETE_TODO', payload: { todo }})
    const deleteTodo = await todoService.deleteTodo(todo)
    dispatch({ type: 'DELETE_TODO_COMPLETE', payload: { todo }})
  }

  const handleFilterTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const completed = event.target.checked
    dispatch({ type: 'FILTER_TODOS', payload: { completed }})
  }

  if (state.addLoading) {
    return <h1>add loading</h1>
  }

  if (state.loading) {
    return <h1>Loading</h1>
  }

  if (state.updateLoading) {
    return <h1>update Loading</h1>
  }

  if (state.deleteLoading) {
    return <h1>delete Loading</h1>
  }
  return (
    <main >
      <div className="container mx-auto flex flex-col shadow-lg w-96 rounded-2xl bg-white p-5 gap-3">
        <div className="flex flex-row justify-between gap-6 place-content-center">
          <div className="flex flex-row gap-2">
            <div className="text-[#818181]">
              {state.counter}
            </div>
            <div>
             Shoping List
            </div>
          </div>
          <div >
            <input className="m-1" type="checkbox" checked={state.completed} onChange={handleFilterTodo}/>Completed
          </div>
        </div>
        <TodoList >
          {state.filteredTodos.map(todo => <TodoItem key={todo.id} item={todo} onChange={handleUpdateItem} onDelete={handleDeleteItem}/>)}
        </TodoList>
        <button className="bg-gray-500 self-end" onClick={handleAddItem}>+ Add an item</button>
      </div>
    </main>
  )
}

function TodoList(props: React.PropsWithChildren) {
  return (
    <ul className="flex flex-col place-content-center gap-1">
      {props.children}
    </ul>
  )
}

interface TodoItemProps {
  item: Todo,
  onChange: (todo: Todo) => void
  onDelete: (todo: Todo) => void
}

function TodoItem(props: TodoItemProps) {
  const item = props.item
  const id = item.id
  const onChange = props.onChange
  const onDelete = props.onDelete
  // const [title, setTitle] = useState(item?.title ?? 'Untitled')
  // const [checked, setChecked] = useState(item?.checked ?? false)
  const title = item.title
  const checked = item.checked

  // useEffect(() => {
  //   const newtodo = {
  //     id,
  //     title,
  //     checked
  //   }
  //   console.log(newtodo)
  // }, [title, checked])

  const handleCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    const newtodo = {
      id,
      title,
      checked
    }
    onChange?.(newtodo)
  }

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value
    const newtodo = {
      id,
      title,
      checked
    }
    onChange?.(newtodo)
  }

  const handleDelete = () => {
    onDelete?.(item)
  }
  return (
    <li className="flex flex-row p-4 gap-3 group rounded-xl bg-background-color hover:bg-[#ebebeb]">
      <input type="checkbox" checked={checked} onChange={handleCheckChange}/>
      <input className="bg-background-color basis-full group-hover:bg-[#ebebeb] outline-none" value={title} onChange={handleTitleChange}/>
      <button className="invisible group-hover:visible"onClick={handleDelete}>❌</button>
    </li>
  )
}