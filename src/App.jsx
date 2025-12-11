import React, { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import Header from './components/Header'

const WEBHOOK_URL = 'https://cleanplateinnovations.app.n8n.cloud/webhook/62c3bf2e-d431-49ad-b52f-ce257193a764/chat'

function App() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => uuidv4())
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setMessages([{
      id: uuidv4(),
      role: 'assistant',
      content: "Hey! I'm Nolan's AI travel squad—three agents working together to plan your perfect trip. One finds the luxury options, one hunts for deals, and I synthesize the best of both. Tell me where you want to go and when!",
      timestamp: new Date()
    }])
  }, [])

  const sendMessage = async (content) => {
    if (!content.trim() || isLoading) return

    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          action: 'sendMessage',
          chatInput: content.trim()
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      const assistantContent = data.output || data.text || data.response || 
        (typeof data === 'string' ? data : JSON.stringify(data))

      const assistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: `Sorry, I couldn't connect to the travel planning service. Please try again.\n\nError: ${error.message}`,
        timestamp: new Date(),
        isError: true
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{
      id: uuidv4(),
      role: 'assistant',
      content: "Fresh start! Where to next?",
      timestamp: new Date()
    }])
  }

  return (
    <div className="app">
      <div className="background-texture"></div>
      <Header onClear={clearChat} />
      
      <main className="chat-container">
        <div className="messages-wrapper">
          <div className="messages">
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <div className="message assistant">
                <div className="message-avatar">
                  <span>✈</span>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </main>
      
      <footer className="footer">
        <p>Built by Nolan with Claude + n8n</p>
      </footer>
    </div>
  )
}

export default App