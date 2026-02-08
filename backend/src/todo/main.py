# backend/src/todo/main.py
# Main FastAPI application for the Todo Full-Stack Web Application

from fastapi import FastAPI, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging

# Import rate limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Import JWT token verification
from .auth.jwt import verify_jwt_token, TokenData

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Todo API",
    version="1.0.0",
    description="A modern full-stack Nexa API with authentication and task management"
)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "http://localhost:3001",  # Alternative local port
        "https://todo-cli-app-production.up.railway.app",  # Deployed frontend
        "http://todo-cli-app-production.up.railway.app",   # In case of mixed content
        "*"  # Allow all for development (remove in production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex=r"https?://.*\.railway\.app"  # Allow any railway.app subdomain
)

# Import and include API routers
from .api.auth import auth_router
from .api.tasks import tasks_router
from .api.chat import chat_router

app.include_router(auth_router)
app.include_router(tasks_router)
app.include_router(chat_router)


# Add a custom exception handler to properly handle redirect issues
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.warning(f"HTTP exception {exc.status_code} for {request.method} {request.url.path}")

    # For redirect responses, make sure to include CORS headers
    if exc.status_code in [301, 302, 303, 307, 308]:
        response = JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail, "redirect": True}
        )
        # Add CORS headers to redirect responses too
        response.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Expose-Headers"] = "Authorization"
        return response
    else:
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail}
        )

@app.on_event("startup")
async def on_startup():
    """Create database tables and validate environment on application startup"""
    from .database.session import engine
    from .models.user import User
    from .models.task import Task
    from .env_validation import validate_environment
    from sqlmodel import SQLModel

    # Validate environment variables
    validate_environment()

    # Create all tables
    SQLModel.metadata.create_all(engine)

@app.get("/")
def read_root():
    return {"message": "Todo API is running!"}


@app.get("/api/health")
def health_check():
    """Simple health check endpoint to test connectivity"""
    return {"status": "ok", "message": "API is running"}


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.warning(f"HTTP exception {exc.status_code} for {request.method} {request.url.path}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error for {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": [
                {
                    "loc": error["loc"],
                    "msg": error["msg"],
                    "type": error["type"]
                }
                for error in exc.errors()
            ]
        }
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception occurred: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."}
    )