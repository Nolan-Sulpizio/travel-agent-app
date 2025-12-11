import React from 'react'

function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  
  const formatContent = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br />')
  }
  
  return (
    <div className={`message ${isUser ? 'user' : 'assistant'} ${message.isError ? 'error' : ''}`}>
      {!isUser && (
        <div className="message-avatar">
          <span>✈</span>
        </div>
      )}
      <div className="message-content">
        <div 
          className="message-text"
          dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
        />
      </div>
    </div>
  )
}

export default ChatMessage