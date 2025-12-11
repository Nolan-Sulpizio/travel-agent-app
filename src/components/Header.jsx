import React from 'react'

function Header({ onClear }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">✈</span>
          <div className="logo-text">
            <h1>Nolan's Travel Agent</h1>
            <span className="tagline">AI-Powered Trip Planning</span>
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