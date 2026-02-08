from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Optional
from pydantic import BaseModel
from jwt import PyJWTError, decode
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize security scheme
security = HTTPBearer()


class TokenData(BaseModel):
    user_id: str  # Changed to string to match User model
    email: str


def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> TokenData:
    """
    Verify JWT token and return user information.
    This function will be used as a dependency in API endpoints to ensure
    the user is authenticated.
    """
    token = credentials.credentials
    secret = os.getenv("JWT_SECRET", os.getenv("BETTER_AUTH_SECRET", "your-super-secret-jwt-secret-here"))
    algorithm = "HS256"

    try:
        # Decode the token
        payload = decode(token, secret, algorithms=[algorithm])

        user_id: str = payload.get("id")  # Changed to string
        email: str = payload.get("email")

        if user_id is None or email is None:
            raise HTTPException(status_code=401, detail="Invalid token: missing user data")

        return TokenData(user_id=user_id, email=email)

    except PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")