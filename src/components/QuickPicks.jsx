/**
 * QuickPicks Component
 * 
 * Grid of popular destination shortcuts for quick trip initiation.
 * Provides one-click access to common travel requests.
 * 
 * @module components/QuickPicks
 */

import React from 'react'

/**
 * Curated list of popular travel destinations.
 * Each destination includes a display name and representative emoji.
 * 
 * @constant {Array<{name: string, emoji: string}>}
 */
const destinations = [
  { name: 'Paris', emoji: '🗼' },
  { name: 'Tokyo', emoji: '🏯' },
  { name: 'Bali', emoji: '🏝️' },
  { name: 'New York', emoji: '🗽' },
  { name: 'Barcelona', emoji: '🇪🇸' },
  { name: 'Iceland', emoji: '🧊' },
]

/**
 * QuickPicks - Destination shortcut buttons displayed on welcome screen.
 * 
 * Provides quick access to popular destinations without typing.
 * Only shown when the welcome message is the only message in chat.
 * 
 * @param {Object} props
 * @param {function} props.onSelect - Callback when destination is clicked
 * 
 * @returns {JSX.Element} Rendered quick picks grid
 * 
 * @example
 * <QuickPicks onSelect={(destination) => {
 *   sendMessage(`I want to go to ${destination}`)
 * }} />
 */
function QuickPicks({ onSelect }) {
  return (
    <div className="quick-picks">
      <p className="quick-picks-label">Popular destinations</p>
      <div className="quick-picks-grid" role="group" aria-label="Quick destination picks">
        {destinations.map(dest => (
          <button
            key={dest.name}
            className="quick-pick-btn"
            onClick={() => onSelect(dest.name)}
            aria-label={`Plan trip to ${dest.name}`}
          >
            <span className="quick-pick-emoji" role="img" aria-hidden="true">
              {dest.emoji}
            </span>
            <span className="quick-pick-name">{dest.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickPicks
