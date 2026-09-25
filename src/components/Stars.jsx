export default function Stars({ value }) {
  const full = Math.round(value)
  return (
    <span className="stars" aria-label={`${value} sao`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= full ? 'star on' : 'star'}>★</span>
      ))}
      <span className="rating-num">{value.toFixed(1)}</span>
    </span>
  )
}
