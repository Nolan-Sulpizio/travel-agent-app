import React, { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import Header from './components/Header'
import QuickPicks from './components/QuickPicks'

const WEBHOOK_URL = 'https://cleanplateinnovations.app.n8n.cloud/webhook/62c3bf2e-d431-49ad-b52f-ce257193a764/chat'

const WELCOME_MESSAGE = "Hey! I'm Nolan's AI travel squad—three agents researching your perfect trip in parallel. Tell me: **where** you want to go, **when**, **how many travelers**, and whether you're chasing **luxury, deals, or best value**. The more context (occasion, vibe, must-dos), the better I can tailor it!"

const LOADING_MESSAGES = [
  "The Snob is browsing five-star hotels...",
  "The Miser is hunting for deals...",
  "Comparing business class vs budget airlines...",
  "Researching hidden local gems...",
  "The Boss is making final decisions...",
  "Crunching the numbers...",
  "Finding the perfect balance..."
]

function App() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [sessionId] = useState(() => uuidv4())
  const [darkMode, setDarkMode] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const messagesEndRef = useRef(null)
  const loadingIntervalRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  const createWelcomeMessage = () => ({
    id: uuidv4(),
    role: 'assistant',
    content: WELCOME_MESSAGE,
    timestamp: new Date(),
    isWelcome: true
  })

  useEffect(() => {
    setMessages([createWelcomeMessage()])
  }, [])

  const startLoadingMessages = () => {
    let index = 0
    setLoadingMessage(LOADING_MESSAGES[0])
    loadingIntervalRef.current = setInterval(() => {
      index = (index + 1) % LOADING_MESSAGES.length
      setLoadingMessage(LOADING_MESSAGES[index])
    }, 3000)
  }

  const stopLoadingMessages = () => {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current)
      loadingIntervalRef.current = null
    }
  }

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
    startLoadingMessages()

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
      
      // Show confetti if it looks like a complete itinerary
      if (assistantContent.includes('Itinerary') || assistantContent.includes('TOTAL') || assistantContent.includes('✈️')) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 4000)
      }
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
      stopLoadingMessages()
    }
  }

  const clearChat = () => {
    setMessages([createWelcomeMessage()])
  }

  const handleQuickPick = (destination) => {
    sendMessage(`I want to go to ${destination} for a week. Best value options please!`)
  }

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  const shareTrip = async () => {
    const tripContent = messages
      .filter(m => m.role === 'assistant' && !m.isWelcome && !m.isError)
      .map(m => m.content)
      .join('\n\n---\n\n')
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Travel Itinerary",
          text: tripContent
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      await navigator.clipboard.writeText(tripContent)
      alert('Trip copied to clipboard!')
    }
  }

  const hasItinerary = messages.some(m => 
    m.role === 'assistant' && !m.isWelcome && !m.isError
  )

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      {showConfetti && <Confetti />}
      <div className="background-texture"></div>
      <Header 
        onClear={clearChat} 
        onToggleDark={toggleDarkMode}
        darkMode={darkMode}
        onShare={shareTrip}
        hasItinerary={hasItinerary}
      />
      
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
                <div className="message-content loading-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <p className="loading-text">{loadingMessage}</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {messages.length === 1 && messages[0].isWelcome && (
          <QuickPicks onSelect={handleQuickPick} />
        )}
        
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </main>
      
      <footer className="footer">
        <p>Built by Nolan with Claude + n8n</p>
      </footer>
    </div>
  )
}

// Confetti component
function Confetti() {
  const colors = ['#c4a574', '#a08050', '#f5f2ed', '#6b6560', '#2d2926']
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)]
  }))

  return (
    <div className="confetti-container">
      {confetti.map(c => (
        <div
          key={c.id}
          className="confetti-piece"
          style={{
            left: `${c.left}%`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            backgroundColor: c.color
          }}
        />
      ))}
    </div>
  )
}

export default App
