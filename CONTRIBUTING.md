# Contributing to Travel Agent App

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9+ or yarn 1.22+
- Git
- A text editor (VS Code recommended)

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/travel-agent-app.git
   cd travel-agent-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your webhook URL
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Code Style

### JavaScript/JSX

- Use functional components with hooks
- Prefer `const` over `let`, avoid `var`
- Use destructuring for props
- Keep components focused and single-purpose
- Use meaningful variable and function names

```jsx
// ✅ Good
function ChatMessage({ message }) {
  const { role, content, isError } = message;
  return (/* ... */);
}

// ❌ Avoid
function ChatMessage(props) {
  var r = props.message.role;
  return (/* ... */);
}
```

### CSS

- Use CSS custom properties for theming
- Follow BEM-like naming for classes
- Mobile-first responsive design
- Avoid `!important` unless absolutely necessary

```css
/* ✅ Good */
.message-content {
  background: var(--bg-secondary);
}

.message-content--error {
  border-color: var(--error);
}

/* ❌ Avoid */
.msg {
  background: #f5f2ed !important;
}
```

## Component Guidelines

### Creating New Components

1. Create file in `src/components/`
2. Use PascalCase for component names
3. Export as default
4. Add JSDoc comments for props

```jsx
/**
 * ComponentName - Brief description
 * 
 * @param {Object} props
 * @param {string} props.title - The title to display
 * @param {function} props.onClick - Click handler
 */
function ComponentName({ title, onClick }) {
  return (
    <div className="component-name" onClick={onClick}>
      {title}
    </div>
  );
}

export default ComponentName;
```

### Component Structure

```
src/components/
├── ComponentName.jsx    # Component file
└── ComponentName.css    # Optional: component-specific styles
```

## Git Workflow

### Branch Naming

- `feature/` - New features (e.g., `feature/voice-input`)
- `fix/` - Bug fixes (e.g., `fix/mobile-scroll`)
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

### Commit Messages

Follow conventional commits:

```
type(scope): description

feat(chat): add voice input support
fix(ui): resolve mobile keyboard overlap
docs(readme): update deployment instructions
refactor(app): extract message handling logic
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make your changes**
   - Keep commits atomic and focused
   - Write meaningful commit messages

3. **Test your changes**
   ```bash
   npm run build  # Ensure it builds
   npm run preview  # Test production build
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature
   ```

5. **PR Description Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   How did you test this?

   ## Screenshots (if applicable)
   ```

## Testing (Future)

We plan to add testing infrastructure. When available:

```bash
npm run test        # Run unit tests
npm run test:e2e    # Run E2E tests
npm run coverage    # Generate coverage report
```

## Project Structure

```
travel-agent-app/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks (future)
│   ├── utils/          # Utility functions (future)
│   ├── App.jsx         # Main application
│   ├── main.jsx        # Entry point
│   └── styles.css      # Global styles
├── public/             # Static assets (future)
├── tests/              # Test files (future)
└── docs/               # Additional documentation
```

## Questions?

- Open an issue for bugs or feature requests
- Tag @Nolan-Sulpizio for urgent matters

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
