import React from 'react'

function Header({ onClear }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">✈</span>
          <div className="logo-text">
            <h1>Travel Agent</h1>
            <span className="tagline">Your Personal Trip Planner</span>
          </div>
        </div>
        <button className="clear-btn" onClick={onClear}>
          <span>New Trip</span>
        </button>
      </div>
    </header>
  )
}

export default Header