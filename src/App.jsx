/**
 * Travel Agent App - Main Application Component
 * 
 * Orchestrates the AI-powered travel planning chat interface.
 * Manages conversation state, session handling, and communication
 * with the n8n multi-agent workflow backend.
 * 
 * @module App
 */

import React, { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import Header from './components/Header'
import QuickPicks from './components/QuickPicks'

/**
 * Webhook URL for the n8n travel agent workflow.
 * Configure via VITE_WEBHOOK_URL environment variable.
 * @constant {string}
 */
const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || 'https://cleanplateinnovations.app.n8n.cloud/webhook/62c3bf2e-d431-49ad-b52f-ce257193a764/chat'

/**
 * Initial welcome message displayed to users.
 * Explains the multi-agent system and required input format.
 * @constant {string}
 */
const WELCOME_MESSAGE = "Hey! I'm Nolan's AI travel squad—three agents researching your perfect trip in parallel. Tell me: **where** you want to go, **when**, **how many travelers**, and whether you're chasing **luxury, deals, or best value**. The more context (occasion, vibe, must-dos), the better I can tailor it!"

/**
 * Rotating messages displayed during API calls.
 * Provides feedback about what the agents are doing.
 * @constant {string[]}
 */
const LOADING_MESSAGES = [
  "The Snob is browsing five-star hotels...",
  "The Miser is hunting for deals...",
  "Comparing business class vs budget airlines...",
  "Researching hidden local gems...",
  "The Boss is making final decisions...",
  "Crunching the numbers...",
  "Finding the perfect balance..."
]

/**
 * Message object structure used throughout the application.
 * @typedef {Object} Message
 * @property {string} id - Unique identifier (UUIDv4)
 * @property {'user'|'assistant'} role - Message sender
 * @property {string} content - Message text content
 * @property {Date} timestamp - When the message was created
 * @property {boolean} [isWelcome] - True for initial welcome message
 * @property {boolean} [isError] - True for error messages
 */

/**
 * Main application component.
 * 
 * Responsibilities:
 * - Manages conversation state (messages array)
 * - Handles session persistence via UUIDv4
 * - Communicates with n8n webhook backend
 * - Coordinates theme, loading states, and celebrations
 * 
 * @returns {JSX.Element} The rendered application
 */
function App() {
  // Conversation state
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  
  // Session ID persists for the entire conversation
  // Enables n8n to maintain context across messages
  const [sessionId] = useState(() => uuidv4())
  
  // UI state
  const [darkMode, setDarkMode] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  
  // Refs for scroll behavior and loading interval cleanup
  const messagesEndRef = useRef(null)
  const loadingIntervalRef = useRef(null)

  /**
   * Scrolls the message container to show the latest message.
   * Uses smooth scrolling for better UX.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize dark mode from system preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)
  }, [])

  // Apply dark mode class to body for global styling
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  /**
   * Creates the initial welcome message object.
   * @returns {Message} Welcome message
   */
  const createWelcomeMessage = () => ({
    id: uuidv4(),
    role: 'assistant',
    content: WELCOME_MESSAGE,
    timestamp: new Date(),
    isWelcome: true
  })

  // Show welcome message on mount
  useEffect(() => {
    setMessages([createWelcomeMessage()])
  }, [])

  /**
   * Starts rotating through loading messages.
   * Updates every 3 seconds to indicate ongoing agent activity.
   */
  const startLoadingMessages = () => {
    let index = 0
    setLoadingMessage(LOADING_MESSAGES[0])
    loadingIntervalRef.current = setInterval(() => {
      index = (index + 1) % LOADING_MESSAGES.length
      setLoadingMessage(LOADING_MESSAGES[index])
    }, 3000)
  }

  /**
   * Stops the loading message rotation.
   * Called when API response is received.
   */
  const stopLoadingMessages = () => {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current)
      loadingIntervalRef.current = null
    }
  }

  /**
   * Sends a message to the n8n webhook and handles the response.
   * 
   * Flow:
   * 1. Add user message to state
   * 2. Set loading state
   * 3. POST to webhook with sessionId and message
   * 4. Parse response (handles multiple response formats)
   * 5. Add assistant message to state
   * 6. Trigger confetti if itinerary detected
   * 
   * @param {string} content - The user's message text
   */
  const sendMessage = async (content) => {
    if (!content.trim() || isLoading) return

    // Create and add user message
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
      
      // Handle various response formats from n8n
      // Priority: output > text > response > raw string > JSON stringify
      const assistantContent = data.output || data.text || data.response || 
        (typeof data === 'string' ? data : JSON.stringify(data))

      const assistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Celebrate complete itineraries with confetti!
      if (assistantContent.includes('Itinerary') || 
          assistantContent.includes('TOTAL') || 
          assistantContent.includes('✈️')) {
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

  /**
   * Clears the chat and shows a fresh welcome message.
   * Called when user clicks "New Trip" button.
   */
  const clearChat = () => {
    setMessages([createWelcomeMessage()])
  }

  /**
   * Handles quick pick destination selection.
   * Sends a pre-formatted message for the selected destination.
   * 
   * @param {string} destination - Selected destination name
   */
  const handleQuickPick = (destination) => {
    sendMessage(`I want to go to ${destination} for a week. Best value options please!`)
  }

  /**
   * Toggles between light and dark mode.
   */
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  /**
   * Shares the trip itinerary via native share API or clipboard.
   * Collects all assistant messages (excluding welcome and errors).
   */
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

  // Determine if there's content worth sharing
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

/**
 * Confetti celebration animation component.
 * Renders falling confetti pieces when an itinerary is complete.
 * 
 * @returns {JSX.Element} Confetti animation overlay
 */
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
