import React from 'react'

const destinations = [
  { name: 'Paris', emoji: '🗼' },
  { name: 'Tokyo', emoji: '🏯' },
  { name: 'Bali', emoji: '🏝️' },
  { name: 'New York', emoji: '🗽' },
  { name: 'Barcelona', emoji: '🇪🇸' },
  { name: 'Iceland', emoji: '🧊' },
]

function QuickPicks({ onSelect }) {
  return (
    <div className="quick-picks">
      <p className="quick-picks-label">Popular destinations</p>
      <div className="quick-picks-grid">
        {destinations.map(dest => (
          <button
            key={dest.name}
            className="quick-pick-btn"
            onClick={() => onSelect(dest.name)}
          >
            <span className="quick-pick-emoji">{dest.emoji}</span>
            <span className="quick-pick-name">{dest.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickPicks
