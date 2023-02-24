'use client'
import { useState, useEffect, useReducer, useCallback } from 'react'

type Todo = {
  id: number
  title: string
  checked: boolean
}

const defaultTodos: Todo[] = [
  { id: 1, title: 'Item1', checked: true },
  { id: 2, title: 'Item2', checked: true },
  { id: 3, title: 'Item3', checked: true },
  { id: 4, title: 'Item4', checked: true },
  { id: 5, title: 'Item5', checked: true }
]

let index = (defaultTodos.at(-1)?.id ?? -1) + 1
let checkedFilter = false

function getNewTodoItem() {
  const newTodo: Todo = {
    id: index,
    title: `Item${index}`,
    checked: true
  }
  index += 1
  return newTodo
}

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
  todos: Todo[]
  filteredTodos: Todo[]
  completed: boolean
  counter: string
}

type Action =
  | { type: 'ADD_TODO' }
  | { type: 'UPDATE_TODO', payload: { todo: Todo } }
  | { type: 'DELETE_TODO', payload: { todo: Todo } }
  | { type: 'FILTER_TODOS', payload: { completed: boolean } }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TODO': {
      const newTodo = getNewTodoItem()
      const newTodos = [...state.todos, newTodo]
      const filteredTodos = filterTodos(newTodos, state.completed)
      const counter = getCounter(newTodos)
      return {
        ...state,
        todos: newTodos,
        filteredTodos,
        counter
      }
    }
    case 'UPDATE_TODO': {
      const updatedTodo = action.payload.todo
      const updatedIndex = state.todos.findIndex((todo) => todo.id === updatedTodo.id)
      const updatedTodos = [...state.todos]
      updatedTodos.splice(updatedIndex, 1, updatedTodo)
      const filteredTodos = filterTodos(updatedTodos, state.completed)
      const counter = getCounter(updatedTodos)
      return {
        ...state,
        todos: updatedTodos,
        filteredTodos,
        counter
      }
    }
    case 'DELETE_TODO': {
      const deletedTodo = action.payload.todo
      const deleteIndex = state.todos.findIndex((todo) => todo.id === deletedTodo.id)
      const updatedTodos = [...state.todos]
      updatedTodos.splice(deleteIndex, 1)
      const filteredTodos = filterTodos(updatedTodos, state.completed)
      const counter = getCounter(updatedTodos)
      return {
        ...state,
        todos: updatedTodos,
        filteredTodos,
        counter
      }
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

const initialState: State = {
  todos: defaultTodos,
  filteredTodos: filterTodos(defaultTodos, false),
  completed: false,
  counter: getCounter(defaultTodos)
}

export default function Page() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleAddItem = () => {
    dispatch({ type: 'ADD_TODO' })
  }

  const handleUpdateItem = (todo: Todo) => {
    dispatch({ type: 'UPDATE_TODO', payload: { todo }})
  }

  const handleDeleteItem = (todo: Todo) => {
    dispatch({ type: 'DELETE_TODO', payload: { todo }})
  }

  const handleFilterTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const completed = event.target.checked
    dispatch({ type: 'FILTER_TODOS', payload: { completed }})
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