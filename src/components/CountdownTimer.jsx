import { useState, useEffect } from 'react'

// Counts down to the next multiple of `hours` from midnight, so it always
// shows a believable "time left" without needing a fixed end date.
export default function CountdownTimer({ hours = 4 }) {
  const getRemaining = () => {
    const now = new Date()
    const msInBlock = hours * 60 * 60 * 1000
    const elapsed = (now - new Date(now).setHours(0, 0, 0, 0)) % msInBlock
    return msInBlock - elapsed
  }

  const [remaining, setRemaining] = useState(getRemaining())

  useEffect(() => {
    const t = setInterval(() => setRemaining(getRemaining()), 1000)
    return () => clearInterval(t)
  }, [])

  const h = String(Math.floor(remaining / 3600000)).padStart(2, '0')
  const m = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, '0')
  const s = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0')

  return (
    <span className="countdown">
      <span className="cbox">{h}</span>:<span className="cbox">{m}</span>:<span className="cbox">{s}</span>
    </span>
  )
}
