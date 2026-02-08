"""Conversation Service for the AI Todo Chatbot"""
from sqlmodel import Session, select
from ..models.conversation import Conversation, Message
from uuid import UUID
from typing import List, Optional
import logging
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException

logger = logging.getLogger(__name__)


class ConversationService:
    def __init__(self, session: Session):
        self.session = session

    def get_or_create_conversation(self, user_id: str) -> Conversation:
        """Get existing conversation for user or create new one with error handling"""
        try:
            statement = select(Conversation).where(Conversation.user_id == user_id)
            conversation = self.session.exec(statement).first()

            if not conversation:
                conversation = Conversation(user_id=user_id)
                self.session.add(conversation)
                self.session.commit()
                self.session.refresh(conversation)
                logger.info(f"Created new conversation for user {user_id}")

            return conversation
        except SQLAlchemyError as e:
            logger.error(f"Database error getting/creating conversation for user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Database error occurred")
        except Exception as e:
            logger.error(f"Unexpected error getting/creating conversation: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

    def get_conversation_messages(self, conversation_id: UUID) -> List[Message]:
        """Retrieve all messages for a conversation, ordered by creation time"""
        try:
            statement = select(Message).where(
                Message.conversation_id == conversation_id
            ).order_by(Message.created_at)
            messages = self.session.exec(statement).all()
            logger.debug(f"Retrieved {len(messages)} messages for conversation {conversation_id}")
            return messages
        except SQLAlchemyError as e:
            logger.error(f"Database error retrieving messages for conversation {conversation_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Database error occurred")
        except Exception as e:
            logger.error(f"Unexpected error retrieving messages: {str(e)}")
            raise HTTPException(status_code=500, detail="Internal server error")

    def save_user_message(self, conversation_id: UUID, content: str) -> Message:
        """Save user message to database with error handling"""
        try:
            message = Message(
                conversation_id=conversation_id,
                role="user",
                content=content
            )
            self.session.add(message)
            self.session.commit()
            self.session.refresh(message)
            logger.info(f"Saved user message to conversation {conversation_id}")
            return message
        except SQLAlchemyError as e:
            logger.error(f"Database error saving user message: {str(e)}")
            self.session.rollback()
            raise HTTPException(status_code=500, detail="Database error occurred")
        except Exception as e:
            logger.error(f"Unexpected error saving user message: {str(e)}")
            self.session.rollback()
            raise HTTPException(status_code=500, detail="Internal server error")

    def save_assistant_message(self, conversation_id: UUID, content: str) -> Message:
        """Save assistant response to database with error handling"""
        try:
            message = Message(
                conversation_id=conversation_id,
                role="assistant",
                content=content
            )
            self.session.add(message)
            self.session.commit()
            self.session.refresh(message)
            logger.info(f"Saved assistant message to conversation {conversation_id}")
            return message
        except SQLAlchemyError as e:
            logger.error(f"Database error saving assistant message: {str(e)}")
            self.session.rollback()
            raise HTTPException(status_code=500, detail="Database error occurred")
        except Exception as e:
            logger.error(f"Unexpected error saving assistant message: {str(e)}")
            self.session.rollback()
            raise HTTPException(status_code=500, detail="Internal server error")