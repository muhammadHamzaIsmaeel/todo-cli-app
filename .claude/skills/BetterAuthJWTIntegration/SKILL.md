---
name: better-auth-jwt-integration
description: Integrate Better Auth (Next.js frontend) with FastAPI backend using JWT tokens for secure multi-user API access. Covers enabling JWT plugin, issuing tokens, attaching to headers in frontend API client, and verifying tokens in FastAPI middleware. Use shared BETTER_AUTH_SECRET for symmetric signing/verification. Essential for Phase II multi-user isolation. NOT for session-based auth only.
---

# Better Auth JWT Integration

**Core Thesis**: Secure full-stack authentication by having Better Auth on Next.js frontend issue JWT tokens that FastAPI backend verifies for user isolation.

JWT tokens enable stateless authentication where the backend can verify user identity without calling the frontend, using a shared secret for signing and verification.

## When to Activate

Activate this skill when:
- Building multi-user Nexa with separate frontend and backend
- Implementing authentication between Next.js and FastAPI
- Securing REST API endpoints with user-specific data isolation
- Setting up JWT-based authentication flow
- Configuring shared secrets between frontend and backend services

## Core Concepts

### 1. Authentication Architecture

```
Frontend (Next.js + Better Auth)
│
├── Login/Signup → Session created
├── Call /api/auth/token → Get JWT
├── API Client → Attach Bearer token to every request
│
Backend (FastAPI)
│
├── Middleware/Dependency → Extract & verify JWT using shared BETTER_AUTH_SECRET
├── Get user_id from payload
└── Filter queries by user_id (task.user_id == authenticated_user_id)
```

### 2. JWT Token Flow

| Step | Action | Component |
|------|--------|-----------|
| 1 | User logs in | Frontend (Better Auth) |
| 2 | Session created, JWT issued | Better Auth JWT plugin |
| 3 | Token stored in session/localStorage | Frontend |
| 4 | API request with Bearer token | Frontend API Client |
| 5 | Extract token from header | FastAPI Middleware |
| 6 | Verify signature with shared secret | FastAPI + python-jose |
| 7 | Decode user_id from payload | FastAPI Dependency |
| 8 | Filter data by user_id | FastAPI Route Handler |

### 3. Key Decisions

| Decision | Options | Recommended |
|----------|---------|-------------|
| **Signing Method** | Symmetric (shared secret) | ✅ Use same BETTER_AUTH_SECRET in both services |
| **Signing Method** | Asymmetric (JWKS) | Advanced - use for production with key rotation |
| **Token Storage** | HTTP-only cookie | If using bearer plugin |
| **Token Storage** | Client storage | ✅ For manual /token endpoint |
| **Expiry** | Default 7 days | ✅ Adjust via plugin config if needed |

## Quick Start

### Step 1: Better Auth Configuration

```typescript
// auth.ts (in Next.js root or lib folder)
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
  database: {
    // Your Neon PostgreSQL config
    provider: "postgres",
    url: process.env.DATABASE_URL,
  },
  plugins: [
    jwt({
      // Optional: customize expiry, etc.
      // Default uses BETTER_AUTH_SECRET for signing
      expiresIn: "7d", // 7 days
    })
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  // Other config...
});

export type Session = typeof auth.$Infer.Session;
```

### Step 2: Frontend API Client

```typescript
// lib/api.ts
import { authClient } from "better-auth/client";

export const api = {
  async getTasks(userId: string) {
    const { data: session } = await authClient.getSession();
    const token = session?.token; // From /token endpoint or session

    if (!token) {
      throw new Error("Not authenticated");
    }

    const res = await fetch(`/api/${userId}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return res.json();
  },

  async createTask(userId: string, task: { title: string; description?: string }) {
    const { data: session } = await authClient.getSession();
    const token = session?.token;

    if (!token) {
      throw new Error("Not authenticated");
    }

    const res = await fetch(`/api/${userId}/tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    return res.json();
  },
};
```

### Step 3: Frontend Token Retrieval

```typescript
// After login
const { data } = await authClient.signIn.email({
  email: "user@example.com",
  password: "password123",
});

// Get JWT token
const tokenRes = await fetch("/api/auth/token");
const { token } = await tokenRes.json();

// Store token in session or use directly
```

### Step 4: FastAPI JWT Verification

```python
# backend/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os

SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"  # Better Auth default for symmetric

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Extract and verify JWT token from Authorization header.
    Returns user_id from token payload.
    """
    token = credentials.credentials
    
    try:
        # Decode and verify token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Extract user_id (could be "sub" or "id" depending on config)
        user_id: str = payload.get("sub") or payload.get("id")
        
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user identifier"
            )
        
        return user_id
    
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {str(e)}"
        )
```

### Step 5: Protected FastAPI Routes

```python
# backend/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from .auth import get_current_user
from .models import Task

app = FastAPI()

@app.get("/api/{user_id}/tasks")
async def get_tasks(
    user_id: str,
    auth_user_id: str = Depends(get_current_user)
):
    """
    Get all tasks for authenticated user.
    Verifies user_id in URL matches authenticated user.
    """
    # Verify URL user_id matches authenticated user_id
    if user_id != auth_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access other user's tasks"
        )
    
    # Query tasks WHERE user_id = auth_user_id
    # (Implementation depends on database setup)
    return {"tasks": []}

@app.post("/api/{user_id}/tasks")
async def create_task(
    user_id: str,
    task: dict,
    auth_user_id: str = Depends(get_current_user)
):
    """
    Create new task for authenticated user.
    """
    if user_id != auth_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot create tasks for other users"
        )
    
    # Create task with user_id = auth_user_id
    return {"message": "Task created"}
```

## Environment Variables

Both services must share the same secret:

```bash
# .env.local (Frontend - Next.js)
BETTER_AUTH_SECRET=your-super-long-random-secret-key-here-minimum-32-characters
DATABASE_URL=postgresql://user:password@neon.tech/dbname
NEXT_PUBLIC_API_URL=http://localhost:8000

# .env (Backend - FastAPI)
BETTER_AUTH_SECRET=your-super-long-random-secret-key-here-minimum-32-characters
DATABASE_URL=postgresql://user:password@neon.tech/dbname
```

**CRITICAL**: Both `BETTER_AUTH_SECRET` values must be EXACTLY the same!

## Security Benefits

| Benefit | Description |
|---------|-------------|
| **User Isolation** | Each user only sees their own tasks |
| **Stateless Auth** | Backend doesn't need to call frontend to verify users |
| **Token Expiry** | JWTs expire automatically (e.g., after 7 days) |
| **No Shared DB Session** | Frontend and backend verify auth independently |
| **Tamper-Proof** | JWT signature prevents token modification |

## API Behavior After Auth

| Before Auth | After Auth |
|-------------|------------|
| Open endpoints | All endpoints require valid JWT token |
| No user context | Every request has authenticated user_id |
| Global data access | Users only see their own data |
| No authorization | Requests without token receive 401 Unauthorized |

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do Instead |
|---------|--------------|
| Hardcode secrets | Use .env files with BETTER_AUTH_SECRET |
| Skip token verification | Always verify signature + expiry |
| Store user_id in URL only | Verify JWT matches URL user_id |
| Long-lived tokens without refresh | Use short expiry (7 days default) |
| Expose full JWT payload | Only use necessary claims (sub/id) |
| Same secret for dev and prod | Use different secrets per environment |
| Commit secrets to git | Add .env to .gitignore |

## Testing Your Integration

```bash
# 1. Login and get token
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# 2. Get JWT token
curl http://localhost:3000/api/auth/token \
  -H "Cookie: better-auth.session_token=..."

# 3. Test protected endpoint
curl http://localhost:8000/api/user123/tasks \
  -H "Authorization: Bearer eyJhbGc..."

# Expected: 200 OK with user's tasks
# Without token: 401 Unauthorized
# Wrong user_id: 403 Forbidden
```

## Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| 401 Unauthorized | Secret mismatch | Verify BETTER_AUTH_SECRET is same in both .env files |
| 401 Unauthorized | Token expired | Check token expiry, re-login if needed |
| 403 Forbidden | user_id mismatch | Ensure URL user_id matches token user_id |
| Token not found | Session not created | Verify Better Auth login flow |
| Import errors | Missing dependencies | Install python-jose[cryptography] |

## Dependencies

```bash
# Backend
uv add python-jose[cryptography] python-dotenv

# Frontend
npm install better-auth
```

## Integration with Other Skills

This skill connects to:
- **neon-postgresql-setup**: Database for storing users and tasks
- **monorepo-spec-kit-structure**: Organizing full-stack project with specs

## Framework-Agnostic Concepts

While this skill uses Better Auth + FastAPI, the JWT concepts apply to any stack:

| Concept | Universal Principle |
|---------|-------------------|
| Shared Secret | Any JWT system needs symmetric or asymmetric keys |
| Bearer Token | Standard HTTP Authorization header pattern |
| Token Verification | Always verify signature before trusting payload |
| User Isolation | Filter database queries by authenticated user |

---

**Skill Metadata**

**Created**: 2025-01-04  
**Phase**: Phase II - Full-Stack Web Application  
**Stack**: Next.js 16 + FastAPI + Better Auth + JWT  
**Version**: 1.0.0