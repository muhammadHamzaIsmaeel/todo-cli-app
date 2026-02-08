---
name: chatkit-config
description: Configure OpenAI ChatKit for frontend chatbot UI. Covers domain allowlist setup, env key (NEXT_PUBLIC_OPENAI_DOMAIN_KEY), integration with custom chat endpoint. Use for Phase III UI setup in Next.js.
---

# ChatKit Config

**Core Thesis**: Set up OpenAI ChatKit in Next.js frontend with proper domain allowlist configuration and secure integration with custom backend chat endpoint for AI-powered conversations.

The configuration ensures secure communication between ChatKit and your custom backend endpoint while maintaining OpenAI's security requirements.

## When to Activate

Activate this skill when:
- Integrating OpenAI ChatKit with your Next.js frontend
- Setting up domain allowlist for ChatKit security
- Configuring environment variables for domain key
- Connecting ChatKit to custom backend chat endpoint
- Implementing secure frontend-backend communication
- Preparing for Phase III UI integration

## Core Concepts

### 1. Architecture Flow

```
Next.js Frontend with ChatKit
│
├── NEXT_PUBLIC_OPENAI_DOMAIN_KEY from env
├── ChatKit component initialization
├── User sends message in ChatKit UI
├── ChatKit validates domain key with OpenAI
├── POST to custom backend endpoint: /api/{user_id}/chat
├── Backend processes with AI agent and MCP tools
└── Response returned to ChatKit UI

OpenAI Dashboard
│
├── Domain allowlist configuration
├── Register allowed domains (e.g., localhost:3000, yourdomain.com)
├── Generate NEXT_PUBLIC_OPENAI_DOMAIN_KEY
└── Validate requests from registered domains only
```

### 2. Security Model

| Component | Purpose | Security Role |
|-----------|---------|---------------|
| Domain Allowlist | Restricts ChatKit usage to approved domains | Prevents unauthorized usage |
| NEXT_PUBLIC_OPENAI_DOMAIN_KEY | Verifies domain authenticity | Proves domain registration |
| Backend Proxy | Custom endpoint for business logic | Separates AI logic from UI |

### 3. Key Decisions

| Decision | Options | Recommended |
|----------|---------|-------------|
| **Domain Key Storage** | Environment variable | ✅ NEXT_PUBLIC_OPENAI_DOMAIN_KEY |
| **Endpoint Integration** | Custom proxy to backend | ✅ /api/{user_id}/chat pattern |
| **User Context** | Pass user_id in endpoint | ✅ Required for authentication |
| **Security** | Domain allowlist required | ✅ Mandatory for ChatKit usage |

## Quick Start

### Step 1: OpenAI Dashboard Setup

1. Go to [OpenAI Dashboard](https://platform.openai.com/)
2. Navigate to Settings → Domain Allowlist
3. Add your domains:
   - `localhost:3000` (development)
   - `yourdomain.com` (production)
4. Generate and copy your `NEXT_PUBLIC_OPENAI_DOMAIN_KEY`
5. Add to your `.env.local` file

### Step 2: Environment Variables

```bash
# frontend/.env.local
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your-domain-key-from-openai-dashboard
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000  # Your backend URL
NEXT_PUBLIC_CHAT_ENDPOINT=/api/chat  # Or your custom endpoint
```

### Step 3: ChatKit Component Setup

```jsx
// frontend/src/components/ChatInterface.jsx
import { useAssistant, Message } from '@openai/realtime-console';
import { useState, useRef, useEffect } from 'react';

export default function ChatInterface({ userId }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Initialize ChatKit with domain key
  const {
    status,
    messages,
    input: assistantInput,
    setInput: setAssistantInput,
    append,
    reload,
    stop,
    handleSubmit
  } = useAssistant({
    api: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${userId}/chat`,
    threadId: userId, // Use user ID as thread identifier
    onError: (error) => {
      console.error('Chat error:', error);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Append message to ChatKit
    await append({ role: 'user', content: input });
    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <strong>{message.role}: </strong>
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={status !== 'ready'}
        />
        <button type="submit" disabled={status !== 'ready'}>
          Send
        </button>
      </form>

      {status !== 'ready' && (
        <div className="status">Status: {status}</div>
      )}
    </div>
  );
}
```

### Step 4: Backend Endpoint Integration

```javascript
// frontend/src/pages/api/chat.js (proxy to your backend)
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, user_id } = await request.json();

    // Forward to your backend chat endpoint
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/${user_id}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${request.headers.get('authorization')?.replace('Bearer ', '')}`,
      },
      body: JSON.stringify({ message })
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend error: ${backendResponse.statusText}`);
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
```

### Step 5: Page Integration

```jsx
// frontend/src/pages/chat.jsx
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react'; // If using auth
import ChatInterface from '../components/ChatInterface';

export default function ChatPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/login');
    return <div>Please log in to access the chat</div>;
  }

  return (
    <div className="chat-page">
      <h1>AI Todo Assistant</h1>
      <ChatInterface userId={session.user.id} />
    </div>
  );
}
```

## Setup Process

| Step | Action | Location |
|------|--------|----------|
| 1 | Deploy frontend application | Your hosting platform |
| 2 | Add domain to OpenAI allowlist | OpenAI Dashboard → Settings → Domain Allowlist |
| 3 | Get NEXT_PUBLIC_OPENAI_DOMAIN_KEY | OpenAI Dashboard after domain registration |
| 4 | Configure environment variables | `.env.local` file |
| 5 | Test ChatKit integration | Frontend application |
| 6 | Verify backend connectivity | Network tab in browser dev tools |

## Environment Variables

```bash
# frontend/.env.local
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=sk-...  # From OpenAI Dashboard
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000  # Your backend URL
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Your frontend URL
NEXT_PUBLIC_CHAT_ENDPOINT=/api/chat  # Custom chat endpoint path
```

## Security Benefits

| Benefit | Description |
|---------|-------------|
| **Domain Restriction** | ChatKit only works on approved domains |
| **Key Verification** | OpenAI validates domain authenticity |
| **Request Origin** | Prevents unauthorized usage of ChatKit |
| **Secure Communication** | Encrypted traffic between components |

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do Instead |
|---------|--------------|
| Use ChatKit without domain allowlist | Always register domains in OpenAI Dashboard |
| Hardcode domain key in source | Use environment variables |
| Direct ChatKit to backend without proxy | Use Next.js API routes as proxy |
| Share domain key publicly | Keep it in NEXT_PUBLIC_ variables securely |
| Skip user authentication | Always verify user identity |
| Expose backend directly to ChatKit | Use proxy layer for security |

## Testing Your Configuration

```bash
# 1. Verify environment variables
echo $NEXT_PUBLIC_OPENAI_DOMAIN_KEY

# 2. Check domain registration
# Visit OpenAI Dashboard → Settings → Domain Allowlist
# Confirm your domain is listed

# 3. Test chat functionality
# Start frontend: npm run dev
# Navigate to chat page
# Send test message
# Check browser console for errors
# Verify network requests succeed

# 4. Test backend connectivity
curl -X POST http://localhost:8000/api/testuser/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

## Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| ChatKit not loading | Domain not allowed | Check OpenAI Dashboard domain allowlist |
| Domain key invalid | Copied incorrectly | Regenerate key in OpenAI Dashboard |
| CORS errors | Backend not accessible | Verify backend URL and authentication |
| Authentication issues | User context missing | Ensure proper auth integration |
| Messages not sending | Network connectivity | Check browser console and network tab |
| Rate limiting | Too many requests | Implement request throttling |

## Dependencies

```bash
# Frontend
npm install @openai/realtime-console react react-dom next
```

## Integration with Other Skills

This skill connects to:
- **stateless-chat-setup**: For backend chat endpoint that ChatKit communicates with
- **openai-agents-mcp-integration**: For AI processing that backend endpoint uses
- **better-auth-integration**: For user authentication in chat interface

## Framework-Agnostic Concepts

While this skill uses Next.js + ChatKit, the concepts apply to any frontend:

| Concept | Universal Principle |
|---------|-------------------|
| Domain Allowlist | Third-party services often require domain registration |
| Environment Keys | Sensitive configuration stored securely |
| API Proxies | Frontend-to-backend communication pattern |
| Authentication | User context in chat sessions |
| Security | Validate all external service integrations |

---

**Skill Metadata**

**Created**: 2026-01-15
**Phase**: Phase III - AI Chatbot Integration
**Stack**: Next.js + OpenAI ChatKit
**Version**: 1.0.0