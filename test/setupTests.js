import '@testing-library/jest-dom/extend-expect'
import 'isomorphic-fetch'
import { server } from '../mocks/server.js'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
