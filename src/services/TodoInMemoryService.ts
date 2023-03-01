import { Todo } from '@/types'
import { TodoService } from './TodoService'

const defaultTodos: Todo[] = [
  { id: 1, title: 'Item1', checked: true },
  { id: 2, title: 'Item2', checked: true },
  { id: 3, title: 'Item3', checked: true },
  { id: 4, title: 'Item4', checked: true },
  { id: 5, title: 'Item5', checked: true }
]

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default class TodoInMemoryService implements TodoService {
  latestID = (defaultTodos.at(-1)?.id ?? 0) + 1
  todos = defaultTodos

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
    await delay(1000)
    return this.todos
  }

  async createTodo(): Promise<Todo> {
    await delay(1000)
    const newTodo = this.getNewTodoItem()
    this.todos = [...this.todos, newTodo]
    return newTodo
  }

  async updateTodo(todo: Todo): Promise<Todo> {
    await delay(1000)
    const updatedTodo = todo
    const updatedIndex = this.todos.findIndex((todo) => todo.id === updatedTodo.id)
    const updatedTodos = [...this.todos]
    updatedTodos.splice(updatedIndex, 1, updatedTodo)
    this.todos = updatedTodos
    return updatedTodo
  }

  async deleteTodo(todo: Todo): Promise<Todo> {
    await delay(1000)
    const deletedTodo = todo
    const deleteIndex = this.todos.findIndex((todo) => todo.id === deletedTodo.id)
    const updatedTodos = [...this.todos]
    updatedTodos.splice(deleteIndex, 1)
    this.todos = updatedTodos
    return deletedTodo
  }
}