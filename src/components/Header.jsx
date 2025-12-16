/**
 * Header Component
 * 
 * Application header with branding, theme toggle,
 * and action buttons for trip management.
 * 
 * @module components/Header
 */

import React from 'react'

/**
 * Header - Top navigation bar with branding and controls.
 * 
 * Features:
 * - Branded logo with tagline
 * - Dark/light mode toggle
 * - Share button (conditional on itinerary)
 * - "New Trip" button to clear chat
 * 
 * @param {Object} props
 * @param {function} props.onClear - Callback to clear chat/start new trip
 * @param {function} props.onToggleDark - Callback to toggle dark mode
 * @param {boolean} props.darkMode - Current theme state
 * @param {function} props.onShare - Callback to share trip
 * @param {boolean} props.hasItinerary - Whether shareable content exists
 * 
 * @returns {JSX.Element} Rendered header component
 * 
 * @example
 * <Header 
 *   onClear={() => clearMessages()}
 *   onToggleDark={() => setDarkMode(!darkMode)}
 *   darkMode={false}
 *   onShare={() => shareTrip()}
 *   hasItinerary={true}
 * />
 */
function Header({ onClear, onToggleDark, darkMode, onShare, hasItinerary }) {
  return (
    <header className="header">
      <div className="header-content">
        {/* Branding */}
        <div className="logo">
          <span className="logo-icon" role="img" aria-label="Airplane">✈</span>
          <div className="logo-text">
            <h1>Nolan's Travel Agent</h1>
            <span className="tagline">AI-Powered Trip Planning</span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="header-actions">
          {/* Dark mode toggle */}
          <button 
            className="icon-btn" 
            onClick={onToggleDark}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              // Sun icon for light mode
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              // Moon icon for dark mode
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
          
          {/* Share button - only shown when there's content to share */}
          {hasItinerary && (
            <button 
              className="icon-btn share-btn" 
              onClick={onShare}
              title="Share trip"
              aria-label="Share trip itinerary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
          )}
          
          {/* New trip button */}
          <button 
            className="clear-btn" 
            onClick={onClear}
            aria-label="Start a new trip"
          >
            <span>New Trip</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
