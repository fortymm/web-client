import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <a href="/" className="btn btn-ghost text-xl">FortyMM</a>
      </div>
      <main className="p-4">
        <button className="btn btn-primary" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </main>
    </>
  )
}

export default App
