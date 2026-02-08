from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
from typing import TYPE_CHECKING
from sqlalchemy import Index

if TYPE_CHECKING:
    from .task import Task


class User(SQLModel, table=True):
    __table_args__ = (
        Index('idx_user_email', 'email'),
        Index('idx_user_created_at', 'created_at'),
    )

    id: Optional[str] = Field(default=None, primary_key=True)
    email: str = Field(sa_column_kwargs={"unique": True}, max_length=255)
    name: Optional[str] = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="user", cascade_delete=True)