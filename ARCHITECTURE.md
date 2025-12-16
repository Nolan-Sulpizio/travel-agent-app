# Architecture Documentation

Technical deep-dive into the Travel Agent App's design decisions, data flow, and implementation details.

## System Overview

The Travel Agent App is a single-page application (SPA) that serves as the frontend interface for a multi-agent AI travel planning system. The architecture emphasizes simplicity, performance, and maintainability.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     React Application                       │ │
│  │                                                             │ │
│  │  ┌─────────┐  ┌────────────────┐  ┌────────────────────┐   │ │
│  │  │  State  │  │   Components   │  │    Side Effects    │   │ │
│  │  │         │  │                │  │                    │   │ │
│  │  │messages │◄─┤ App.jsx        │  │ fetch (webhook)    │   │ │
│  │  │session  │  │ ChatMessage    │  │ localStorage       │   │ │
│  │  │darkMode │  │ ChatInput      │  │ navigator.share    │   │ │
│  │  │loading  │  │ Header         │  │ navigator.clipboard│   │ │
│  │  │         │  │ QuickPicks     │  │                    │   │ │
│  │  └─────────┘  └────────────────┘  └────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTPS POST
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   n8n Workflow Engine                       │ │
│  │                                                             │ │
│  │  Webhook ──► Router ──┬──► The Snob (Luxury Agent)         │ │
│  │  Trigger              │                                     │ │
│  │                       ├──► The Miser (Budget Agent)         │ │
│  │                       │                                     │ │
│  │                       └──► The Boss (Decision Agent)        │ │
│  │                                     │                       │ │
│  │                            ◄────────┘                       │ │
│  │                       Response Synthesizer                  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Build | Vite 5.x | Fast HMR, native ESM, minimal config |
| UI | React 18.x | Component model, hooks, ecosystem |
| Styling | CSS Custom Properties | Native theming, no runtime overhead |
| IDs | uuid v9 | Session and message identification |
| Backend | n8n | Visual workflow builder, parallel agent orchestration |

## State Management

The app uses React's built-in state management (useState, useRef) rather than external libraries. This is intentional given the app's scope.

### State Shape

```javascript
{
  messages: [
    {
      id: string,          // UUIDv4
      role: 'user' | 'assistant',
      content: string,     // Raw text/markdown
      timestamp: Date,
      isWelcome?: boolean, // Welcome message flag
      isError?: boolean    // Error state flag
    }
  ],
  isLoading: boolean,      // API request in flight
  loadingMessage: string,  // Rotating loading text
  sessionId: string,       // UUIDv4, persists for conversation
  darkMode: boolean,       // Theme state
  showConfetti: boolean    // Celebration animation trigger
}
```

### State Transitions

```
                    ┌─────────────────┐
                    │   Initial Load  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ Welcome Message │
                    │    Displayed    │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
   ┌────────▼────────┐      │       ┌────────▼────────┐
   │   User Types    │      │       │  Quick Pick     │
   │    Message      │      │       │   Selected      │
   └────────┬────────┘      │       └────────┬────────┘
            │               │                │
            └───────────────┼────────────────┘
                            │
                   ┌────────▼────────┐
                   │  sendMessage()  │
                   │  isLoading=true │
                   └────────┬────────┘
                            │
            ┌───────────────┼───────────────┐
            │                               │
   ┌────────▼────────┐             ┌────────▼────────┐
   │   API Success   │             │   API Error     │
   │ Add assistant   │             │ Add error msg   │
   │     message     │             │                 │
   └────────┬────────┘             └────────┬────────┘
            │                               │
            └───────────────┬───────────────┘
                            │
                   ┌────────▼────────┐
                   │ isLoading=false │
                   │ Ready for input │
                   └─────────────────┘
```

## Component Architecture

### Component Hierarchy

```
App
├── Confetti (conditional)
├── Header
│   ├── Logo
│   ├── DarkModeToggle
│   ├── ShareButton (conditional)
│   └── NewTripButton
├── ChatContainer
│   ├── MessagesWrapper
│   │   └── ChatMessage[] (mapped)
│   │       └── CopyButton (conditional)
│   ├── LoadingIndicator (conditional)
│   └── QuickPicks (conditional on welcome state)
├── ChatInput
└── Footer
```

### Component Responsibilities

| Component | Responsibility | Props |
|-----------|---------------|-------|
| `App` | State management, API calls, orchestration | None |
| `Header` | Branding, theme toggle, actions | `onClear`, `onToggleDark`, `darkMode`, `onShare`, `hasItinerary` |
| `ChatMessage` | Message rendering, markdown parsing, copy | `message` |
| `ChatInput` | Text input, keyboard handling, auto-resize | `onSend`, `disabled` |
| `QuickPicks` | Destination shortcuts | `onSelect` |

## Data Flow

### Message Lifecycle

```
1. User Input
   └── ChatInput.handleSubmit()
       └── App.sendMessage(content)
           ├── Create user message object
           ├── Append to messages state
           ├── Set isLoading = true
           └── POST to webhook

2. API Processing
   └── n8n receives request
       ├── Parallel agent execution
       └── Response synthesis

3. Response Handling
   └── App receives response
       ├── Create assistant message object
       ├── Append to messages state
       ├── Check for itinerary (confetti trigger)
       └── Set isLoading = false
```

### API Contract

**Request:**
```typescript
interface WebhookRequest {
  sessionId: string;    // UUID for conversation continuity
  action: 'sendMessage';
  chatInput: string;    // User's message
}
```

**Response:**
```typescript
interface WebhookResponse {
  output?: string;      // Primary response field
  text?: string;        // Fallback field
  response?: string;    // Fallback field
}
```

## Styling Architecture

### CSS Custom Properties

The app uses a CSS custom property system for consistent theming:

```css
:root {
  /* Colors */
  --bg-primary: #faf8f5;
  --bg-secondary: #f5f2ed;
  --text-primary: #2d2926;
  --text-secondary: #6b6560;
  --accent: #c4a574;
  --accent-dark: #a08050;
  
  /* Typography */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', sans-serif;
  
  /* Spacing (implicit through component styles) */
}

body.dark-mode {
  --bg-primary: #1a1918;
  /* ... overrides */
}
```

### Animation System

| Animation | Trigger | Duration |
|-----------|---------|----------|
| `fadeIn` | New message | 300ms |
| `bounce` | Typing indicator | 1.4s infinite |
| `pulse` | Loading text | 2s infinite |
| `confetti-fall` | Itinerary complete | 2-4s |

## Security Considerations

### Current Implementation
- Webhook URL should be in environment variable (not hardcoded)
- Session IDs are client-generated (no server validation)
- No authentication layer

### Recommendations
1. Move webhook URL to `VITE_WEBHOOK_URL` environment variable
2. Consider adding rate limiting on the n8n side
3. Add CORS restrictions to webhook endpoint
4. Consider session validation if sensitive data is involved

## Performance Optimizations

### Current
- Vite for optimized bundling
- CSS-only animations (no JS animation libraries)
- Lazy message rendering via React's reconciliation

### Future Considerations
- Virtual scrolling for long conversations
- Service worker for offline support
- Image optimization for destination photos

## Error Handling

```javascript
// API Error Flow
try {
  const response = await fetch(WEBHOOK_URL, {...})
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  // Process response
} catch (error) {
  // Display user-friendly error message
  // Log to console for debugging
}
```

## Testing Strategy (Recommended)

| Level | Tools | Coverage |
|-------|-------|----------|
| Unit | Vitest | Component logic, formatContent() |
| Integration | React Testing Library | User flows |
| E2E | Playwright | Full chat interaction |

## Build & Deployment

```bash
# Development
npm run dev        # Vite dev server with HMR

# Production
npm run build      # Output to dist/
npm run preview    # Preview production build

# Deployment targets
# - Cloudflare Pages (recommended)
# - Vercel
# - Netlify
# - Any static hosting
```

## Future Architecture Considerations

1. **Conversation Persistence**: Add localStorage or IndexedDB for conversation history
2. **Multi-user Support**: Authentication layer + server-side session management
3. **Real-time Updates**: WebSocket connection for streaming responses
4. **Analytics**: Event tracking for usage patterns
5. **Internationalization**: i18n support for multi-language
