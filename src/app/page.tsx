'use client'
import { useState, useEffect } from 'react'

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

function getNewTodoItem() {
  const newTodo: Todo = {
    id: index,
    title: `Item${index}`,
    checked: true
  }
  index += 1
  return newTodo
}

export default function Page() {
  const [todos, setTodos] = useState(defaultTodos)

  const handleAddItem = () => {
    const newTodo = getNewTodoItem()
    const newTodos = [...todos, newTodo]
    setTodos(newTodos)

    // setTodos(oldTodos => {
    //   return [...oldTodos, newtodo]
    // })
  }

  const handleUpdateItem = (updatedTodo: Todo) => {
    const updatedIndex = todos.findIndex((todo) => todo.id === updatedTodo.id)
    const updatedTodos = [...todos]
    updatedTodos.splice(updatedIndex, 1, updatedTodo)
    setTodos(updatedTodos)
  }

  const handleDeleteItem = (deleteTodo: Todo) => {
    const deleteIndex = todos.findIndex((todo) => todo.id === deleteTodo.id)
    const updatedTodos = [...todos]
    updatedTodos.splice(deleteIndex, 1)
    setTodos(updatedTodos)
  }
  return (
    <main >
      <div className="container mx-auto flex flex-col shadow-lg w-96 rounded-2xl bg-white p-5 gap-3">
        <div className="flex flex-row justify-between gap-6 place-content-center">
          <div className="flex flex-row gap-2">
            <div>
            0/2
            </div>
            <div>
             Shoping List
            </div>
          </div>
          <div >
            <input className="m-1" type="checkbox" />Completed
          </div>
        </div>
        <TodoList >
          {todos.map(todo => <TodoItem key={todo.id} item={todo} onChange={handleUpdateItem} onDelete={handleDeleteItem}/>)}
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