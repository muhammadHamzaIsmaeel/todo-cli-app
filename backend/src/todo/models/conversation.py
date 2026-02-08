from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import TYPE_CHECKING, List
from uuid import UUID, uuid4
import typing

if TYPE_CHECKING:
    from .user import User
    from .task import Task


class ConversationBase(SQLModel):
    user_id: str = Field(index=True)


class Conversation(ConversationBase, table=True):
    __tablename__ = "conversations"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to messages
    messages: List["Message"] = Relationship(back_populates="conversation")


class MessageBase(SQLModel):
    conversation_id: UUID = Field(foreign_key="conversations.id", index=True)
    role: str = Field(regex="^(user|assistant)$")  # user or assistant
    content: str


class Message(MessageBase, table=True):
    __tablename__ = "messages"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversations.id", index=True)
    role: str = Field(regex="^(user|assistant)$")  # user or assistant
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to conversation
    conversation: Conversation = Relationship(back_populates="messages")