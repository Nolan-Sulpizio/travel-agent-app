/**
 * ChatInput Component
 * 
 * Auto-resizing text input with keyboard shortcuts
 * for sending messages to the travel agent.
 * 
 * @module components/ChatInput
 */

import React, { useState, useRef, useEffect } from 'react'

/**
 * ChatInput - Message input field with auto-resize and keyboard handling.
 * 
 * Features:
 * - Auto-resizing textarea (up to 200px)
 * - Enter to send, Shift+Enter for newline
 * - Disabled state during API calls
 * - Send button with airplane icon
 * 
 * @param {Object} props
 * @param {function} props.onSend - Callback when message is submitted
 * @param {boolean} props.disabled - Disables input during loading
 * 
 * @returns {JSX.Element} Rendered input component
 * 
 * @example
 * <ChatInput 
 *   onSend={(message) => console.log(message)} 
 *   disabled={false} 
 * />
 */
function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  /**
   * Auto-resize textarea based on content.
   * Runs whenever the input value changes.
   */
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get accurate scrollHeight
      textareaRef.current.style.height = 'auto'
      // Set height to scrollHeight, capped at 200px
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [value])

  /**
   * Handles form submission.
   * Trims whitespace and clears input after sending.
   * 
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim() && !disabled) {
      onSend(value)
      setValue('')
    }
  }

  /**
   * Handles keyboard shortcuts.
   * - Enter: Submit message
   * - Shift+Enter: Insert newline
   * 
   * @param {KeyboardEvent} e - Keydown event
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Where would you like to go?"
          disabled={disabled}
          rows={1}
          aria-label="Type your travel request"
        />
        <button 
          type="submit" 
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          {/* Paper airplane icon */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </form>
  )
}

export default ChatInput
