import { exec } from 'child_process'
import { promisify } from 'util'

import truncate from '../utils/truncate'

beforeAll(async done => {
  const execPromise = promisify(exec)

  await truncate()
  await execPromise('yarn db:seed')

  done()
})

afterAll(async done => {
  await truncate()
  done()
})
