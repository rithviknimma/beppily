import { useEffect, useState } from 'react'
import { timeToEvent } from '../lib/countdown'

const plural = (value, word) => (value === 1 ? word : `${word}s`)
const pad = (value) => String(value).padStart(2, '0')

function BigUnit({ value, word, tilt }) {
  return (
    <div className="unit unit--big crayon-box" style={{ '--tilt': tilt }}>
      <span className="unit__value">{value}</span>
      <span className="unit__label">{plural(value, word)}</span>
    </div>
  )
}

function SmallUnit({ value, word, animate }) {
  return (
    <span className="unit unit--small">
      {/* keyed so the value remounts and re-runs the tick animation */}
      <span className="unit__value" key={animate ? value : undefined}>
        {pad(value)}
      </span>
      <span className="unit__label">{word}</span>
    </span>
  )
}

export default function Countdown() {
  const [time, setTime] = useState(timeToEvent)

  useEffect(() => {
    const tick = setInterval(() => setTime(timeToEvent()), 1000)
    return () => clearInterval(tick)
  }, [])

  return (
    <section className="countdown">
      {time.phase === 'after' && (
        <p className="arrived">beppily ever after starts today</p>
      )}

      <div className="countdown__big">
        <BigUnit value={time.months} word="month" tilt="-2.2deg" />
        <BigUnit value={time.days} word="day" tilt="1.6deg" />
      </div>

      <div className="countdown__small crayon-box">
        <SmallUnit value={time.hours} word="hrs" />
        <span className="colon">:</span>
        <SmallUnit value={time.minutes} word="mins" />
        <span className="colon">:</span>
        <SmallUnit value={time.seconds} word="secs" animate />
      </div>
    </section>
  )
}
