import { useCallback, useEffect, useState } from 'react'
import CatCard from './components/CatCard'
import Countdown from './components/Countdown'
import Doodles from './components/Doodles'
import { fetchCats } from './lib/cats'
import './App.css'

const TITLE = 'beppily ever after'

// A kid switching crayons mid-word, deterministically so it doesn't reshuffle
// on every render.
const CRAYONS = [
  '#d2574f',
  '#e08a3c',
  '#4f8f4a',
  '#4273a8',
  '#8a5fa8',
  '#d2578f',
  '#7b5e3b',
]

function Title() {
  // Grouped into words so the title can wrap between them on a narrow screen
  // (see .title in App.css — the h1 is a wrapping flex row).
  let index = -1

  return (
    <h1 className="title" aria-label={TITLE}>
      {TITLE.split(' ').map((word, wordIndex) => (
        <span key={wordIndex} className="title__word" aria-hidden="true">
          {[...word].map((character) => {
            index += 1
            return (
              <span
                key={index}
                className="title__letter"
                style={{
                  color: CRAYONS[index % CRAYONS.length],
                  '--letter-tilt': `${((index % 5) - 2) * 2.4}deg`,
                  '--letter-lift': `${((index * 7) % 5) - 2}px`,
                }}
              >
                {character}
              </span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}

export default function App() {
  const [cats, setCats] = useState([null, null])
  const [loading, setLoading] = useState(true)

  const loadCats = useCallback(async () => {
    setCats(await fetchCats(2)) // never rejects: falls back to repo cats
    setLoading(false)
  }, [])

  // The initial state is already "loading, no cats yet", so the first fetch
  // doesn't need to set anything before it starts. The lint rule can't see past
  // the await inside loadCats: every setState there runs in a later microtask,
  // not synchronously during this effect.
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    loadCats()
  }, [loadCats])

  const handleNewCat = () => {
    setLoading(true)
    setCats([null, null])
    loadCats()
  }

  return (
    <main className="page">
      <Doodles />
      <Title />
      <Countdown />

      <div className="cats">
        <CatCard name="bep" url={cats[0]} tilt="-2.5deg" />
        <CatCard name="bepper" url={cats[1]} tilt="2deg" />
      </div>

      <button
        className="new-cat crayon-box"
        type="button"
        onClick={handleNewCat}
        disabled={loading}
      >
        new beppies 🐾
      </button>
    </main>
  )
}
