# backend/src/todo/api/auth.py
# Authentication API routes for the Todo Full-Stack Web Application
# Using Better Auth with JWT integration

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import Optional
import uuid
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from jwt import PyJWTError, decode, encode

# Load environment variables
load_dotenv()

from ..database.session import get_session
from ..models.user import User
from ..auth.jwt import verify_jwt_token, TokenData

# Create API router for auth endpoints
auth_router = APIRouter(prefix="/api/auth", tags=["auth"])


# Security scheme for token verification
security = HTTPBearer()


class UserRegister(BaseModel):
    email: str
    password: str
    name: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: str  # Changed to string to match User model
    email: str


def create_access_token(user_id: str, email: str) -> str:  # Changed parameter type to string
    """Create a JWT access token for the user."""
    secret = os.getenv("JWT_SECRET", os.getenv("BETTER_AUTH_SECRET", "your-super-secret-jwt-secret-here"))
    algorithm = "HS256"
    expire = datetime.utcnow() + timedelta(days=30)  # Token expires in 30 days

    to_encode = {
        "id": user_id,
        "email": email,
        "exp": expire.timestamp()
    }

    encoded_jwt = encode(to_encode, secret, algorithm=algorithm)
    return encoded_jwt


@auth_router.post("/register", response_model=AuthResponse)
def register(user_data: UserRegister, session: Session = Depends(get_session)):
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    # Create new user with a generated UUID as string ID
    new_user = User(
        id=str(uuid.uuid4()),  # Generate a string ID
        email=user_data.email,
        name=user_data.name
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # Create JWT token for the new user
    access_token = create_access_token(new_user.id, new_user.email)

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=new_user.id,
        email=new_user.email
    )


@auth_router.post("/login", response_model=AuthResponse)
def login(user_data: UserLogin, session: Session = Depends(get_session)):
    # Find user by email
    user = session.exec(select(User).where(User.email == user_data.email)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # In a real implementation, you would verify the password here
    # For now, we'll assume the password is correct
    # Password verification would be handled by a proper authentication system

    # Create JWT token for the user
    access_token = create_access_token(user.id, user.email)

    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email
    )


@auth_router.post("/logout")
def logout():
    # In a real implementation, you would invalidate the token here
    # For now, we'll just return a success message
    return {"message": "Successfully logged out"}


@auth_router.get("/me")
def get_current_user(token_data: TokenData = Depends(verify_jwt_token)):
    # This endpoint is protected and returns user info based on JWT token
    return {
        "user_id": token_data.user_id,
        "email": token_data.email
    }


# Better Auth compatible endpoints
class BetterAuthUserRegister(BaseModel):
    email: str
    password: str
    name: Optional[str] = None


class BetterAuthUserLogin(BaseModel):
    email: str
    password: str


class BetterAuthSessionResponse(BaseModel):
    user: dict
    access_token: str
    refresh_token: Optional[str] = None
    expires_at: Optional[datetime] = None


@auth_router.post("/use-register")
def better_auth_register(user_data: BetterAuthUserRegister, session: Session = Depends(get_session)):
    """Better Auth compatible register endpoint."""
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    # Create new user with a generated UUID as string ID
    new_user = User(
        id=str(uuid.uuid4()),  # Generate a string ID
        email=user_data.email,
        name=user_data.name
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # Create JWT token for the new user
    access_token = create_access_token(new_user.id, new_user.email)

    return {
        "session": {
            "user": {
                "id": new_user.id,
                "email": new_user.email,
                "name": new_user.name,
                "emailVerified": None
            },
            "access_token": access_token,
            "refresh_token": None,
            "expires_at": None
        },
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
            "emailVerified": None
        }
    }


@auth_router.post("/use-sign-in")
def better_auth_sign_in(user_data: BetterAuthUserLogin, session: Session = Depends(get_session)):
    """Better Auth compatible sign-in endpoint."""
    # Find user by email
    user = session.exec(select(User).where(User.email == user_data.email)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # In a real implementation, you would verify the password here
    # For now, we'll assume the password is correct
    # Password verification would be handled by a proper authentication system

    # Create JWT token for the user
    access_token = create_access_token(user.id, user.email)

    return {
        "session": {
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "emailVerified": None
            },
            "access_token": access_token,
            "refresh_token": None,
            "expires_at": None
        },
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "emailVerified": None
        }
    }


@auth_router.get("/get-session")
def better_auth_get_session(request: Request, session: Session = Depends(get_session)):
    """Better Auth compatible get-session endpoint."""
    # Extract the token from the Authorization header
    auth_header = request.headers.get("authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header[7:]  # Remove "Bearer " prefix
        try:
            # Try to verify the token
            secret = os.getenv("JWT_SECRET", os.getenv("BETTER_AUTH_SECRET", "your-super-secret-jwt-secret-here"))
            algorithm = "HS256"
            payload = decode(token, secret, algorithms=[algorithm])

            user_id: str = payload.get("id")  # Changed to string
            email: str = payload.get("email")

            if user_id is None or email is None:
                # Token is invalid
                return {"user": None, "accessToken": None, "expiresIn": 0}

            # Get user from database to retrieve the actual name
            user = session.get(User, user_id)
            if not user:
                # User not found in database
                return {"user": None, "accessToken": None, "expiresIn": 0}

            # Valid token, return user info
            return {
                "user": {
                    "id": user_id,
                    "email": user.email,
                    "name": user.name or "User",  # Use the actual name from DB, fallback to "User" if None
                    "emailVerified": None
                },
                "accessToken": token,
                "expiresIn": 2592000  # 30 days in seconds
            }
        except PyJWTError:
            # Token is invalid
            return {"user": None, "accessToken": None, "expiresIn": 0}

    # No token provided
    return {"user": None, "accessToken": None, "expiresIn": 0}


@auth_router.post("/sign-out")
def better_auth_sign_out():
    """Better Auth compatible sign-out endpoint."""
    return {"success": True}