import { Suspense } from 'react'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useSession } from '@/lib/api/session'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <Suspense fallback={null}>
      <SessionGate />
    </Suspense>
  )
}

function SessionGate() {
  useSession()
  return <Outlet />
}
