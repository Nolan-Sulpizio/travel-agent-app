/**
 * ChatMessage Component
 * 
 * Renders individual chat messages with markdown formatting,
 * role-based styling, and copy-to-clipboard functionality.
 * 
 * @module components/ChatMessage
 */

import React, { useState } from 'react'

/**
 * ChatMessage - Displays a single message in the chat interface.
 * 
 * Features:
 * - Markdown-to-HTML conversion (bold, italic, headings, links)
 * - User vs assistant visual differentiation
 * - Error state styling
 * - Copy button for assistant messages
 * 
 * @param {Object} props
 * @param {Object} props.message - Message object to render
 * @param {string} props.message.id - Unique message identifier
 * @param {'user'|'assistant'} props.message.role - Message sender
 * @param {string} props.message.content - Raw message content
 * @param {boolean} [props.message.isWelcome] - Welcome message flag
 * @param {boolean} [props.message.isError] - Error message flag
 * 
 * @returns {JSX.Element} Rendered message component
 * 
 * @example
 * <ChatMessage message={{
 *   id: 'abc-123',
 *   role: 'assistant',
 *   content: '**Hello!** How can I help?',
 *   timestamp: new Date()
 * }} />
 */
function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)
  
  // Only show copy button for assistant responses (not welcome or errors)
  const showCopyButton = !isUser && !message.isWelcome && !message.isError
  
  /**
   * Converts markdown-style formatting to HTML.
   * 
   * Supported formats:
   * - **bold** -> <strong>
   * - *italic* -> <em>
   * - # Heading -> <span class="heading">
   * - [text](url) -> <a>
   * - \n -> <br>
   * 
   * @param {string} content - Raw markdown content
   * @returns {string} HTML string
   */
  const formatContent = (content) => {
    let formatted = content
      // Table rows (basic support)
      .replace(/\|(.+)\|/g, (match) => {
        return `<span class="table-row">${match}</span>`
      })
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Headings (h1-h3)
      .replace(/#{1,3}\s(.+)/g, '<span class="heading">$1</span>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Line breaks
      .replace(/\n/g, '<br />')
    
    return formatted
  }

  /**
   * Copies message content to clipboard.
   * Shows "Copied!" feedback for 2 seconds.
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
  
  return (
    <div className={`message ${isUser ? 'user' : 'assistant'} ${message.isError ? 'error' : ''}`}>
      {/* Avatar for assistant messages */}
      {!isUser && (
        <div className="message-avatar">
          <span>✈</span>
        </div>
      )}
      
      <div className="message-content-wrapper">
        <div className="message-content">
          <div 
            className="message-text"
            dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
          />
        </div>
        
        {/* Copy button for assistant responses */}
        {showCopyButton && (
          <button 
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
