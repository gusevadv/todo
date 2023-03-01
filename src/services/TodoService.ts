import { Todo } from '@/types'

export interface TodoService {
  getTodos(): Promise<Todo[]>
  createTodo(): Promise<Todo>
  updateTodo(todo: Todo): Promise<Todo>
  deleteTodo(todo: Todo): Promise<Todo>
}