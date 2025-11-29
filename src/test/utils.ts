import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

export function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

interface TestQueryProviderProps {
  children: ReactNode
  client?: QueryClient
}

export function TestQueryProvider({ children, client }: TestQueryProviderProps) {
  const queryClient = client ?? createTestQueryClient()
  return createElement(QueryClientProvider, { client: queryClient }, children)
}
