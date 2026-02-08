from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional
from typing import TYPE_CHECKING
from sqlalchemy import Index
from enum import Enum

if TYPE_CHECKING:
    from .user import User


class PriorityEnum(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class Task(SQLModel, table=True):
    __table_args__ = (
        Index('idx_task_user_id', 'user_id'),
        Index('idx_task_completed', 'completed'),
        Index('idx_task_created_at', 'created_at'),
        Index('idx_task_priority', 'priority'),
        Index('idx_task_due_date', 'due_date'),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    user_id: str = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # New fields for advanced features
    priority: Optional[PriorityEnum] = Field(default=PriorityEnum.MEDIUM)
    category: Optional[str] = Field(default=None, max_length=255)
    due_date: Optional[datetime] = Field(default=None)
    reminder_date: Optional[datetime] = Field(default=None)

    # Relationship to user
    user: "User" = Relationship(back_populates="tasks")