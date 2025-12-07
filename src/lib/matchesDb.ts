import { openDB, type IDBPDatabase } from 'idb'

const DB_NAME = 'fortymm'
const DB_VERSION = 1
const MATCHES_STORE = 'matches'

export interface StoredGameScore {
  player1Score: number
  player2Score: number
  winnerId: string
}

export interface StoredMatch {
  id: string
  playerId: string | null
  opponentId: string | null
  matchLength: number
  status: 'in_progress' | 'completed'
  games: StoredGameScore[]
  winnerId: string | null
  createdAt: Date
}

type MatchesDB = IDBPDatabase<{
  matches: {
    key: string
    value: StoredMatch
  }
}>

let dbPromise: Promise<MatchesDB> | null = null

function getDb(): Promise<MatchesDB> {
  if (!dbPromise) {
    dbPromise = openDB<{ matches: { key: string; value: StoredMatch } }>(
      DB_NAME,
      DB_VERSION,
      {
        upgrade(db) {
          if (!db.objectStoreNames.contains(MATCHES_STORE)) {
            db.createObjectStore(MATCHES_STORE, { keyPath: 'id' })
          }
        },
      }
    )
  }
  return dbPromise
}

export async function saveMatch(match: StoredMatch): Promise<StoredMatch> {
  const db = await getDb()
  await db.put(MATCHES_STORE, match)
  return match
}

export async function getMatch(id: string): Promise<StoredMatch | undefined> {
  const db = await getDb()
  return db.get(MATCHES_STORE, id)
}

export async function getAllMatches(): Promise<StoredMatch[]> {
  const db = await getDb()
  return db.getAll(MATCHES_STORE)
}

export async function deleteMatch(id: string): Promise<void> {
  const db = await getDb()
  await db.delete(MATCHES_STORE, id)
}

export async function clearAllMatches(): Promise<void> {
  const db = await getDb()
  await db.clear(MATCHES_STORE)
}

export async function resetDb(): Promise<void> {
  if (dbPromise) {
    const db = await dbPromise
    db.close()
    dbPromise = null
  }
}
