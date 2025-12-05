import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  type MatchDetails,
  type MockMatchVariant,
  getMockMatchDetails,
  mockMatchVariants,
} from './mockMatchDetails'

export interface UseMatchDetailsResult {
  data: MatchDetails | null
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

/**
 * A mock hook that simulates fetching match details.
 * Supports variant switching via URL query param: ?variant=pending|scheduled|in_progress|completed|cancelled|doubles
 * Also supports simulating loading/error states via ?loading=true or ?error=true
 */
export function useMatchDetails(matchId: string): UseMatchDetailsResult {
  const [searchParams] = useSearchParams()
  const [data, setData] = useState<MatchDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [fetchTrigger, setFetchTrigger] = useState(0)

  const variant = searchParams.get('variant') as MockMatchVariant | null
  const simulateLoading = searchParams.get('loading') === 'true'
  const simulateError = searchParams.get('error') === 'true'

  // Track if component is mounted to avoid setting state after unmount
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    // Reset state at the start of fetch
    // This is intentional - we need to reset state when deps change
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    setIsError(false)
    setData(null)

    // Simulate network delay
    const delay = simulateLoading ? 2000 : 300

    const timeoutId = setTimeout(() => {
      if (!isMountedRef.current) return

      if (simulateError) {
        setIsError(true)
        setIsLoading(false)
        return
      }

      // Get mock data based on variant or default
      const validVariant = variant && variant in mockMatchVariants ? variant : undefined
      const mockData = getMockMatchDetails(validVariant)

      // Override the ID with the one from the URL
      setData({ ...mockData, id: matchId })
      setIsLoading(false)
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [matchId, variant, simulateLoading, simulateError, fetchTrigger])

  const refetch = useCallback(() => {
    setFetchTrigger((prev) => prev + 1)
  }, [])

  return {
    data,
    isLoading,
    isError,
    refetch,
  }
}
