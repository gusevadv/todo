import { Todo } from '@/types'
import { TodoService } from './TodoService'

const defaultTodos: Todo[] = [
  { id: 1, title: 'Item1', checked: true },
  { id: 2, title: 'Item2', checked: true },
  { id: 3, title: 'Item3', checked: true },
  { id: 4, title: 'Item4', checked: true },
  { id: 5, title: 'Item5', checked: true }
]

export interface Storage {
  setItem(key: string, value: string): void
  getItem(key: string): string | null
}

export class InMemoryStorage implements Storage {
  dictionary: { [key: string]: string } = {}

  setItem(key: string, value: string): void {
    this.dictionary[key] = value
  }

  getItem(key: string): string | null {
    return this.dictionary[key]
  }
}

export function timeoutDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default class TodoStorageService implements TodoService {
  latestID: number

  get todos(): Todo[] {
    const savedTodos = this.getTodosFromStorage()
    if (savedTodos.length === 0) {
      return defaultTodos
    }
    return savedTodos
  }

  set todos(todos: Todo[]) {
    this.saveTodosToStorage(todos)
  }

  storage: Storage
  delay: (ms: number) => Promise<void>

  constructor(
    storage: Storage,
    delay?: (ms: number) => Promise<void>
  ) {
    this.storage = storage
    this.delay = delay ?? timeoutDelay
    this.latestID = (this.todos.at(-1)?.id ?? 0) + 1
  }

  getTodosFromStorage(): Todo[] {
    const todosString = this.storage.getItem('todos')
    if (!todosString) { return [] }
    const todos = JSON.parse(todosString)
    return todos
  }

  saveTodosToStorage(todos: Todo[]) {
    const todosJSON = JSON.stringify(todos)
    this.storage.setItem('todos', todosJSON)
  }

  getNewTodoItem(): Todo {
    const newTodo: Todo = {
      id: this.latestID,
      title: '',
      checked: false
    }
    this.latestID += 1
    return newTodo
  }

  async getTodos(): Promise<Todo[]> {
    await this.delay(1000)
    return this.todos.map(todo => ({ ...todo }))
  }

  async createTodo(): Promise<Todo> {
    await this.delay(1000)
    const newTodo = this.getNewTodoItem()
    this.todos = [...this.todos, newTodo]
    return { ...newTodo }
  }

  async updateTodo(todo: Todo): Promise<Todo> {
    await this.delay(1000)
    const updatedTodo = todo
    const updatedIndex = this.todos.findIndex((todo) => todo.id === updatedTodo.id)
    const updatedTodos = [...this.todos]
    updatedTodos.splice(updatedIndex, 1, updatedTodo)
    this.todos = updatedTodos
    return { ...updatedTodo }
  }

  async deleteTodo(todo: Todo): Promise<Todo> {
    await this.delay(1000)
    const deletedTodo = todo
    const deleteIndex = this.todos.findIndex((todo) => todo.id === deletedTodo.id)
    const updatedTodos = [...this.todos]
    updatedTodos.splice(deleteIndex, 1)
    this.todos = updatedTodos
    return { ...deletedTodo }
  }
}