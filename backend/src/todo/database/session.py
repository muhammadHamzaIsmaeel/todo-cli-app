from sqlmodel import create_engine, Session
from typing import Generator
from .config import DATABASE_URL
import urllib.parse


# Create the database engine with proper SSL handling for Neon
engine = create_engine(
    DATABASE_URL,
    echo=True,
    # Add connection pool settings for Neon
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,    # Recycle connections every 5 minutes
    connect_args={
        "sslmode": "require",  # Ensure SSL is used
    }
)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session