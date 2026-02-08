"""MCP Task Tools for the AI Todo Chatbot"""
from typing import Dict, Any, List
from sqlmodel import Session, select
from ..models.task import Task
from ..database.session import get_session
import logging
from contextlib import contextmanager

logger = logging.getLogger(__name__)


async def add_task(user_id: str, title: str, description: str = "") -> Dict[str, Any]:
    """Add a new task for the user."""
    try:
        # Get database session
        session_gen = get_session()
        session: Session = next(session_gen)

        try:
            task = Task(
                user_id=user_id,
                title=title,
                description=description or "",
                completed=False
            )
            session.add(task)
            session.commit()
            session.refresh(task)

            return {
                "success": True,
                "task_id": str(task.id),
                "message": f"Task '{title}' has been added successfully!",
                "task": {
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description,
                    "completed": task.completed
                }
            }
        finally:
            session.close()
    except Exception as e:
        logger.error(f"Error adding task: {str(e)}")
        return {
            "success": False,
            "message": f"Failed to add task: {str(e)}"
        }


async def list_tasks(user_id: str, status: str = "all") -> List[Dict[str, Any]]:
    """List tasks for the user."""
    try:
        # Get database session
        session_gen = get_session()
        session: Session = next(session_gen)

        try:
            query = select(Task).where(Task.user_id == user_id)

            if status == "completed":
                query = query.where(Task.completed == True)
            elif status == "pending":
                query = query.where(Task.completed == False)
            # if status == "all", no filter needed

            tasks = session.exec(query.order_by(Task.created_at.desc())).all()

            return [
                {
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description,
                    "completed": task.completed,
                    "priority": task.priority.value if task.priority else "medium",
                    "created_at": task.created_at.isoformat()
                }
                for task in tasks
            ]
        finally:
            session.close()
    except Exception as e:
        logger.error(f"Error listing tasks: {str(e)}")
        return []


async def update_task(user_id: str, task_id: str, title: str = "", description: str = "") -> Dict[str, Any]:
    """Update an existing task."""
    try:
        # Get database session
        session_gen = get_session()
        session: Session = next(session_gen)

        try:
            query = select(Task).where(
                Task.id == task_id,
                Task.user_id == user_id
            )
            task = session.exec(query).first()

            if not task:
                return {
                    "success": False,
                    "message": "Task not found or doesn't belong to user"
                }

            if title:
                task.title = title
            if description:
                task.description = description

            session.add(task)
            session.commit()
            session.refresh(task)

            return {
                "success": True,
                "message": f"Task '{task_id}' has been updated successfully!",
                "task": {
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description,
                    "completed": task.completed
                }
            }
        finally:
            session.close()
    except Exception as e:
        logger.error(f"Error updating task: {str(e)}")
        return {
            "success": False,
            "message": f"Failed to update task: {str(e)}"
        }


async def delete_task(user_id: str, task_id: str) -> Dict[str, Any]:
    """Delete a task."""
    try:
        # Get database session
        session_gen = get_session()
        session: Session = next(session_gen)

        try:
            query = select(Task).where(
                Task.id == task_id,
                Task.user_id == user_id
            )
            task = session.exec(query).first()

            if not task:
                return {
                    "success": False,
                    "message": "Task not found or doesn't belong to user"
                }

            session.delete(task)
            session.commit()

            return {
                "success": True,
                "message": f"Task '{task_id}' has been deleted successfully!"
            }
        finally:
            session.close()
    except Exception as e:
        logger.error(f"Error deleting task: {str(e)}")
        return {
            "success": False,
            "message": f"Failed to delete task: {str(e)}"
        }


async def complete_task(user_id: str, task_id: str) -> Dict[str, Any]:
    """Mark a task as complete."""
    try:
        # Get database session
        session_gen = get_session()
        session: Session = next(session_gen)

        try:
            query = select(Task).where(
                Task.id == task_id,
                Task.user_id == user_id
            )
            task = session.exec(query).first()

            if not task:
                return {
                    "success": False,
                    "message": "Task not found or doesn't belong to user"
                }

            task.completed = True
            session.add(task)
            session.commit()
            session.refresh(task)

            return {
                "success": True,
                "message": f"Task '{task_id}' has been marked as complete!",
                "task": {
                    "id": str(task.id),
                    "title": task.title,
                    "description": task.description,
                    "completed": task.completed
                }
            }
        finally:
            session.close()
    except Exception as e:
        logger.error(f"Error completing task: {str(e)}")
        return {
            "success": False,
            "message": f"Failed to complete task: {str(e)}"
        }