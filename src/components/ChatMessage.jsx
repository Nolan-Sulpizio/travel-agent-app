import React, { useState } from 'react'

function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)
  
  // Don't show copy on welcome message or errors
  const showCopyButton = !isUser && !message.isWelcome && !message.isError
  
  const formatContent = (content) => {
    // Handle tables (markdown style)
    let formatted = content
      .replace(/\|(.+)\|/g, (match) => {
        return `<span class="table-row">${match}</span>`
      })
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/#{1,3}\s(.+)/g, '<span class="heading">$1</span>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br />')
    
    return formatted
  }

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
