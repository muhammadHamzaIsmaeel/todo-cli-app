"""Initialize the database with tables."""

from sqlmodel import SQLModel
from sqlalchemy import create_engine
import os
from src.todo.database.config import DATABASE_URL
from src.todo.models.user import User
from src.todo.models.task import Task

def create_tables():
    """Create all database tables."""
    engine = create_engine(DATABASE_URL, echo=True)

    # Create all tables defined in SQLModel models
    SQLModel.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    create_tables()