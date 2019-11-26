import truncate from '../utils/truncate'

beforeAll(async () => {
  await truncate()
})

afterAll(async () => {
  await truncate()
})
