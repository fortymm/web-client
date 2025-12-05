import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MatchDetailPage from './MatchDetailPage'
import FlashProvider from '../FlashProvider'
import { matchHeaderPage } from './MatchHeader.page'
import { participantsSectionPage } from './ParticipantsSection.page'
import { matchMetadataPage } from './MatchMetadata.page'
import { contextLinksPage } from './ContextLinks.page'
import { activityTimelinePage } from './ActivityTimeline.page'
import { matchActionsPage } from './MatchActions.page'
import { matchDetailSkeletonPage } from './MatchDetailSkeleton.page'
import { matchDetailErrorPage } from './MatchDetailError.page'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

interface RenderOptions {
  matchId?: string
  searchParams?: string
}

export const matchDetailPagePage = {
  render(options: RenderOptions = {}) {
    const { matchId = 'test-match-123', searchParams = '' } = options
    const queryClient = createTestQueryClient()
    const initialEntry = `/matches/${matchId}${searchParams ? `?${searchParams}` : ''}`

    render(
      <QueryClientProvider client={queryClient}>
        <FlashProvider>
          <MemoryRouter initialEntries={[initialEntry]}>
            <Routes>
              <Route path="/matches/:id" element={<MatchDetailPage />} />
              <Route path="/matches/:id/score" element={<div>Score Page</div>} />
            </Routes>
          </MemoryRouter>
        </FlashProvider>
      </QueryClientProvider>
    )

    return { queryClient }
  },

  async waitForContent() {
    await waitFor(() => {
      if (screen.queryByTestId('match-detail-skeleton')) {
        throw new Error('Still loading')
      }
    })
  },

  get page() {
    return screen.getByTestId('match-detail-page')
  },

  queryPage() {
    return screen.queryByTestId('match-detail-page')
  },

  querySkeleton() {
    return screen.queryByTestId('match-detail-skeleton')
  },

  queryError() {
    return screen.queryByTestId('match-detail-error')
  },

  // Delegate to child page objects
  header: matchHeaderPage,
  participants: participantsSectionPage,
  metadata: matchMetadataPage,
  contextLinks: contextLinksPage,
  activity: activityTimelinePage,
  actions: matchActionsPage,
  skeleton: matchDetailSkeletonPage,
  error: matchDetailErrorPage,
}
