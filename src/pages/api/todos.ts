import type { NextApiRequest, NextApiResponse } from 'next'
import { Todo } from '@/types'

const defaultTodos: Todo[] = [
  { id: 1, title: 'Item1', checked: true },
  { id: 2, title: 'Item2', checked: true },
  { id: 3, title: 'Item3', checked: true },
  { id: 4, title: 'Item4', checked: true },
  { id: 5, title: 'Item5', checked: true }
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Todo[]>
) {
  res
    .status(200)
    .json(defaultTodos)
}
