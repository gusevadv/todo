import TodoInMemoryService from './TodoInMemoryService'
import { TodoService } from './TodoService'

let todoService: TodoService

beforeEach(() => {
  todoService = new TodoInMemoryService()
})

test('Get todos', async () => {
  const todos = await todoService.getTodos()
  expect(todos.length).toBe(5)
})

test('Get new todo', async () => {
  const newtodo = await todoService.createTodo()
  const todos = await todoService.getTodos()
  expect(todos.length).toBe(6)

  const lastTodo = todos.at(-1)
  expect(lastTodo).toBeDefined()
  expect(lastTodo?.id).toBe(newtodo.id)
})

test.todo('Update todo', () => {

})

test('Delete todo', async () => {
  const todosBefore = await todoService.getTodos()
  const todoToDelete = todosBefore[0]
  const deletedTodo = await todoService.deleteTodo(todoToDelete)
  const todosAfter = await todoService.getTodos()
  expect(todosAfter.length).toBe(4)
  expect(todoToDelete).toStrictEqual(deletedTodo)
})