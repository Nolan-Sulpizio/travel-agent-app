# ✈️ Travel Agent App

A personal AI-powered travel planning chat interface that leverages a multi-agent n8n workflow to research and plan trips in parallel.

![React](https://img.shields.io/badge/React-18.2-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646cff?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## Overview

This app provides a conversational interface for trip planning, powered by three specialized AI agents running in parallel:

| Agent | Role |
|-------|------|
| **The Snob** | Researches luxury accommodations and premium experiences |
| **The Miser** | Hunts for deals, budget options, and cost savings |
| **The Boss** | Synthesizes recommendations and makes final balanced decisions |

## Features

- 💬 **Real-time Chat** - Conversational interface with typing indicators
- 🌙 **Dark Mode** - System-preference-aware theme switching
- 📋 **Copy to Clipboard** - One-click copy of AI responses
- 📤 **Share Trips** - Native share or clipboard export
- 🎉 **Confetti Celebration** - Visual feedback on complete itineraries
- ⚡ **Quick Picks** - Popular destination shortcuts
- 📱 **Responsive Design** - Mobile-first, works on all devices

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│  ┌─────────┐  ┌─────────────┐  ┌────────┐  ┌────────────┐  │
│  │ Header  │  │ ChatMessage │  │ Input  │  │ QuickPicks │  │
│  └─────────┘  └─────────────┘  └────────┘  └────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ POST /webhook
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    n8n Workflow                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ The Snob │    │The Miser │    │ The Boss │              │
│  │ (Luxury) │    │ (Budget) │    │(Decision)│              │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘              │
│       └───────────────┼───────────────┘                    │
│                       ▼                                     │
│              Synthesized Response                           │
└─────────────────────────────────────────────────────────────┘
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical documentation.

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- n8n instance with travel agent workflow configured

### Installation

```bash
# Clone the repository
git clone https://github.com/Nolan-Sulpizio/travel-agent-app.git
cd travel-agent-app

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your webhook URL

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_WEBHOOK_URL` | n8n webhook endpoint for the travel agent workflow | Yes |

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready for deployment to any static hosting (Vercel, Netlify, Cloudflare Pages, etc.).

## Project Structure

```
travel-agent-app/
├── src/
│   ├── components/
│   │   ├── ChatInput.jsx      # Message input with auto-resize
│   │   ├── ChatMessage.jsx    # Individual message rendering
│   │   ├── Header.jsx         # App header with actions
│   │   └── QuickPicks.jsx     # Destination shortcut buttons
│   ├── App.jsx                # Main application logic
│   ├── main.jsx               # React entry point
│   └── styles.css             # Global styles & CSS variables
├── index.html                 # HTML entry point
├── package.json               # Dependencies & scripts
├── vite.config.js             # Vite configuration
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── ARCHITECTURE.md            # Technical documentation
├── CONTRIBUTING.md            # Contribution guidelines
└── README.md                  # This file
```

## Component API

### `<App />`
Main application container managing state, session, and API communication.

### `<ChatInput onSend={fn} disabled={bool} />`
Text input with auto-resize and keyboard shortcuts (Enter to send, Shift+Enter for newline).

### `<ChatMessage message={object} />`
Renders individual messages with markdown formatting, copy functionality.

### `<Header onClear={fn} onToggleDark={fn} darkMode={bool} onShare={fn} hasItinerary={bool} />`
Application header with theme toggle, share, and new trip actions.

### `<QuickPicks onSelect={fn} />`
Grid of popular destination buttons for quick trip initiation.

## n8n Workflow Integration

The app communicates with n8n via webhook. Expected request/response format:

### Request
```json
{
  "sessionId": "uuid-v4",
  "action": "sendMessage",
  "chatInput": "User's travel query"
}
```

### Response
```json
{
  "output": "Formatted travel recommendations with markdown"
}
```

## Styling

The app uses CSS custom properties for theming. Key variables:

```css
--bg-primary: #faf8f5;      /* Background */
--accent: #c4a574;          /* Gold accent */
--font-display: 'Playfair Display';
--font-body: 'DM Sans';
```

Dark mode is automatically applied via `body.dark-mode` class.

## Deployment

### Cloudflare Pages
```bash
npm run build
# Deploy dist/ folder via Cloudflare Dashboard or Wrangler CLI
```

### Vercel
```bash
vercel --prod
```

### Netlify
```bash
netlify deploy --prod --dir=dist
```

## Development

```bash
# Start dev server with hot reload
npm run dev

# Preview production build locally
npm run preview
```

## Related Projects

- **n8n Workflow**: The multi-agent backend powering this interface
- **Clean Plate Innovations**: Parent organization

## License

MIT © Nolan Sulpizio----- CLEAN PLATE INNOVATIONS

---

Built with ❤️ using Claude + n8n ----CLEANPLATEINNOVATIONS
