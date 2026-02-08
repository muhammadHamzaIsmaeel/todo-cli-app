# backend/src/todo/api/tasks.py
# Task management API routes for the Todo Full-Stack Web Application
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime

from ..database.session import get_session
from ..models.task import Task
from ..models.user import User
from ..auth.jwt import verify_jwt_token, TokenData

# Create API router for task endpoints
tasks_router = APIRouter(prefix="/api/tasks", tags=["tasks"])

# Create logger for task endpoints
logger = logging.getLogger(__name__)


class TaskCreateRequest:
    def __init__(self):
        self.title: str
        self.description: Optional[str] = None


class TaskUpdateRequest:
    def __init__(self):
        self.title: Optional[str] = None
        self.description: Optional[str] = None


# Pydantic models for request/response
from pydantic import BaseModel
from pydantic import field_validator
from enum import Enum


class PriorityEnum(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Optional[PriorityEnum] = PriorityEnum.MEDIUM
    category: Optional[str] = None
    due_date: Optional[datetime] = None
    reminder_date: Optional[datetime] = None

    @field_validator('title')
    @classmethod
    def validate_title(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Title cannot be empty')
        if len(v) > 200:
            raise ValueError('Title must be at most 200 characters')
        # Sanitize title - remove potentially harmful characters
        v = v.strip()
        return v

    @field_validator('description', mode='before')
    @classmethod
    def validate_description(cls, v):
        if v is None:
            return v
        if len(v) > 1000:
            raise ValueError('Description must be at most 1000 characters')
        # Sanitize description - remove potentially harmful characters
        v = v.strip()
        return v

    @field_validator('category', mode='before')
    @classmethod
    def validate_category(cls, v):
        if v is None:
            return v
        if len(v) > 255:
            raise ValueError('Category must be at most 255 characters')
        # Sanitize category - remove potentially harmful characters
        v = v.strip()
        return v


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    category: Optional[str] = None
    due_date: Optional[datetime] = None
    reminder_date: Optional[datetime] = None
    completed: Optional[bool] = None

    @field_validator('title', mode='before')
    @classmethod
    def validate_title(cls, v):
        if v is None:
            return v
        if len(v) > 200:
            raise ValueError('Title must be at most 200 characters')
        # Sanitize title - remove potentially harmful characters
        v = v.strip()
        return v

    @field_validator('description', mode='before')
    @classmethod
    def validate_description(cls, v):
        if v is None:
            return v
        if len(v) > 1000:
            raise ValueError('Description must be at most 1000 characters')
        # Sanitize description - remove potentially harmful characters
        v = v.strip()
        return v

    @field_validator('category', mode='before')
    @classmethod
    def validate_category(cls, v):
        if v is None:
            return v
        if len(v) > 255:
            raise ValueError('Category must be at most 255 characters')
        # Sanitize category - remove potentially harmful characters
        v = v.strip()
        return v


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    completed: bool
    user_id: str  # Changed to string to match User model
    created_at: datetime
    updated_at: datetime

    # New fields for advanced features
    priority: Optional[PriorityEnum] = PriorityEnum.MEDIUM
    category: Optional[str] = None
    due_date: Optional[datetime] = None
    reminder_date: Optional[datetime] = None

    class Config:
        from_attributes = True


@tasks_router.post("/", response_model=TaskResponse)
def create_task(
    task_data: TaskCreate,
    token_data: TokenData = Depends(verify_jwt_token),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user.
    Validates that title is between 1-200 characters and description is max 1000 characters.
    """
    logger.info(f"Creating task for user_id: {token_data.user_id}")

    # Validate input
    if not (1 <= len(task_data.title) <= 200):
        logger.warning(f"Invalid title length for user_id: {token_data.user_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title must be between 1 and 200 characters"
        )

    if task_data.description and len(task_data.description) > 1000:
        logger.warning(f"Invalid description length for user_id: {token_data.user_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Description must be at most 1000 characters"
        )

    # Create the task with the authenticated user's ID
    task = Task(
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        category=task_data.category,
        due_date=task_data.due_date,
        reminder_date=task_data.reminder_date,
        user_id=token_data.user_id  # Set the user ID from the JWT token
    )

    session.add(task)
    session.commit()
    session.refresh(task)

    logger.info(f"Task created successfully with id: {task.id} for user_id: {token_data.user_id}")

    return task


@tasks_router.get("/", response_model=List[TaskResponse])
def get_tasks(
    status_filter: Optional[str] = None,
    priority_filter: Optional[PriorityEnum] = None,
    category_filter: Optional[str] = None,
    token_data: TokenData = Depends(verify_jwt_token),
    session: Session = Depends(get_session)
):
    """
    Get all tasks for the authenticated user.
    Optionally filter by status: 'pending', 'completed', or 'all' (default).
    """
    logger.info(f"Fetching tasks for user_id: {token_data.user_id}, "
                f"status_filter: {status_filter}, priority_filter: {priority_filter}, "
                f"category_filter: {category_filter}")

    query = select(Task).where(Task.user_id == token_data.user_id)

    if status_filter == "pending":
        query = query.where(Task.completed == False)
    elif status_filter == "completed":
        query = query.where(Task.completed == True)

    if priority_filter:
        query = query.where(Task.priority == priority_filter)

    if category_filter:
        query = query.where(Task.category.ilike(f"%{category_filter}%"))

    tasks = session.exec(query).all()

    logger.info(f"Returning {len(tasks)} tasks for user_id: {token_data.user_id}")

    return tasks


@tasks_router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    token_data: TokenData = Depends(verify_jwt_token),
    session: Session = Depends(get_session)
):
    """
    Update a task for the authenticated user.
    Validates ownership of the task.
    """
    logger.info(f"Updating task_id: {task_id} for user_id: {token_data.user_id}")

    # Get the existing task
    task = session.get(Task, task_id)

    if not task:
        logger.warning(f"Task not found for update: {task_id}, user_id: {token_data.user_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify that the task belongs to the authenticated user
    if task.user_id != token_data.user_id:
        logger.warning(f"Unauthorized access attempt to task: {task_id}, user_id: {token_data.user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Update fields if provided
    if task_data.title is not None:
        if not (1 <= len(task_data.title) <= 200):
            logger.warning(f"Invalid title length for task update: {task_id}, user_id: {token_data.user_id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title must be between 1 and 200 characters"
            )
        task.title = task_data.title

    if task_data.description is not None:
        if len(task_data.description) > 1000:
            logger.warning(f"Invalid description length for task update: {task_id}, user_id: {token_data.user_id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Description must be at most 1000 characters"
            )
        task.description = task_data.description

    if task_data.priority is not None:
        task.priority = task_data.priority

    if task_data.category is not None:
        if len(task_data.category) > 255:
            logger.warning(f"Invalid category length for task update: {task_id}, user_id: {token_data.user_id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category must be at most 255 characters"
            )
        task.category = task_data.category

    if task_data.due_date is not None:
        task.due_date = task_data.due_date

    if task_data.reminder_date is not None:
        task.reminder_date = task_data.reminder_date

    if task_data.completed is not None:
        task.completed = task_data.completed

    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)

    logger.info(f"Task updated successfully: {task_id} for user_id: {token_data.user_id}")

    return task



@tasks_router.patch("/{task_id}/toggle-status", response_model=TaskResponse)
def toggle_task_status(
    task_id: int,
    token_data: TokenData = Depends(verify_jwt_token),
    session: Session = Depends(get_session)
):
    """
    Toggle the completion status of a task for the authenticated user.
    Validates ownership of the task.
    """
    logger.info(f"Toggling status for task_id: {task_id}, user_id: {token_data.user_id}")

    # Get the existing task
    task = session.get(Task, task_id)

    if not task:
        logger.warning(f"Task not found for status toggle: {task_id}, user_id: {token_data.user_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify that the task belongs to the authenticated user
    if task.user_id != token_data.user_id:
        logger.warning(f"Unauthorized access attempt to task: {task_id}, user_id: {token_data.user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )

    # Toggle the completion status
    new_status = not task.completed
    task.completed = new_status
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    logger.info(f"Task status toggled successfully for task_id: {task_id}, new status: {new_status}, user_id: {token_data.user_id}")

    return task


@tasks_router.delete("/{task_id}")
def delete_task(
    task_id: int,
    token_data: TokenData = Depends(verify_jwt_token),
    session: Session = Depends(get_session)
):
    """
    Delete a task for the authenticated user.
    Validates ownership of the task.
    """
    logger.info(f"Deleting task_id: {task_id} for user_id: {token_data.user_id}")

    # Get the existing task
    task = session.get(Task, task_id)

    if not task:
        logger.warning(f"Task not found for deletion: {task_id}, user_id: {token_data.user_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify that the task belongs to the authenticated user
    if task.user_id != token_data.user_id:
        logger.warning(f"Unauthorized access attempt to task: {task_id}, user_id: {token_data.user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )

    session.delete(task)
    session.commit()

    logger.info(f"Task deleted successfully: {task_id} for user_id: {token_data.user_id}")

    return {"message": "Task deleted successfully"}


class TaskFilterRequest(BaseModel):
    status: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    category: Optional[str] = None
    due_date_start: Optional[datetime] = None
    due_date_end: Optional[datetime] = None
    search: Optional[str] = None


@tasks_router.post("/filter/", response_model=List[TaskResponse])
def filter_tasks(
    filter_data: TaskFilterRequest,
    token_data: TokenData = Depends(verify_jwt_token),
    session: Session = Depends(get_session)
):
    """
    Filter tasks for the authenticated user based on multiple criteria.
    """
    logger.info(f"Filtering tasks for user_id: {token_data.user_id}")

    query = select(Task).where(Task.user_id == token_data.user_id)

    # Apply filters based on provided criteria
    if filter_data.status:
        if filter_data.status.lower() == "completed":
            query = query.where(Task.completed == True)
        elif filter_data.status.lower() == "pending":
            query = query.where(Task.completed == False)

    if filter_data.priority:
        query = query.where(Task.priority == filter_data.priority)

    if filter_data.category:
        query = query.where(Task.category.ilike(f"%{filter_data.category}%"))

    if filter_data.due_date_start:
        query = query.where(Task.due_date >= filter_data.due_date_start)

    if filter_data.due_date_end:
        query = query.where(Task.due_date <= filter_data.due_date_end)

    if filter_data.search:
        search_term = f"%{filter_data.search}%"
        query = query.where(
            (Task.title.ilike(search_term)) |
            (Task.description.ilike(search_term)) |
            (Task.category.ilike(search_term))
        )

    tasks = session.exec(query).all()

    logger.info(f"Returning {len(tasks)} filtered tasks for user_id: {token_data.user_id}")

    return tasks


@tasks_router.get("/categories/", response_model=List[str])
def get_categories(
    token_data: TokenData = Depends(verify_jwt_token),
    session: Session = Depends(get_session)
):
    """
    Get all unique categories for the authenticated user.
    """
    logger.info(f"Getting categories for user_id: {token_data.user_id}")

    query = select(Task.category).where(
        Task.user_id == token_data.user_id
    ).where(
        Task.category.is_not(None)
    ).distinct()

    categories = session.exec(query).all()
    # Filter out any null values that might slip through
    categories = [cat for cat in categories if cat is not None]

    logger.info(f"Returning {len(categories)} categories for user_id: {token_data.user_id}")

    return categories


@tasks_router.get("/priorities/", response_model=dict)
def get_priorities(
    token_data: TokenData = Depends(verify_jwt_token),
    session: Session = Depends(get_session)
):
    """
    Get priority statistics for the authenticated user.
    Returns count of tasks for each priority level.
    """
    logger.info(f"Getting priority stats for user_id: {token_data.user_id}")

    # Count tasks for each priority level
    high_count = session.exec(
        select(Task.id).where(
            (Task.user_id == token_data.user_id) &
            (Task.priority == PriorityEnum.HIGH)
        )
    ).all()

    medium_count = session.exec(
        select(Task.id).where(
            (Task.user_id == token_data.user_id) &
            (Task.priority == PriorityEnum.MEDIUM)
        )
    ).all()

    low_count = session.exec(
        select(Task.id).where(
            (Task.user_id == token_data.user_id) &
            (Task.priority == PriorityEnum.LOW)
        )
    ).all()

    stats = {
        "high": len(high_count),
        "medium": len(medium_count),
        "low": len(low_count),
        "total": len(high_count) + len(medium_count) + len(low_count)
    }

    logger.info(f"Returning priority stats for user_id: {token_data.user_id}: {stats}")

    return stats


@tasks_router.get("/kanban/", response_model=dict)
def get_kanban_tasks(
    token_data: TokenData = Depends(verify_jwt_token),
    session: Session = Depends(get_session)
):
    """
    Get tasks organized by status for Kanban board view.
    Returns tasks grouped by status (todo, in_progress, done).
    """
    logger.info(f"Getting Kanban tasks for user_id: {token_data.user_id}")

    # Get all tasks for the user
    all_tasks = session.exec(
        select(Task).where(Task.user_id == token_data.user_id)
    ).all()

    # Group tasks by status (using completed field for now)
    kanban_data = {
        "todo": [],
        "in_progress": [],
        "done": []
    }

    for task in all_tasks:
        task_response = TaskResponse.model_validate(task)
        if task.completed:
            kanban_data["done"].append(task_response)
        else:
            # For now, put all non-completed tasks in 'todo'
            # In a real implementation, you might have a separate 'status' field
            kanban_data["todo"].append(task_response)

    logger.info(f"Returning Kanban data for user_id: {token_data.user_id}")

    return kanban_data


@tasks_router.get("/calendar/", response_model=List[TaskResponse])
def get_calendar_tasks(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    token_data: TokenData = Depends(verify_jwt_token),
    session: Session = Depends(get_session)
):
    """
    Get tasks for calendar view within a date range.
    If no date range is provided, returns all tasks with due dates.
    """
    logger.info(f"Getting calendar tasks for user_id: {token_data.user_id}, "
                f"start_date: {start_date}, end_date: {end_date}")

    query = select(Task).where(
        (Task.user_id == token_data.user_id) &
        (Task.due_date.is_not(None))  # Only tasks with due dates
    )

    if start_date:
        query = query.where(Task.due_date >= start_date)

    if end_date:
        query = query.where(Task.due_date <= end_date)

    tasks = session.exec(query).all()

    logger.info(f"Returning {len(tasks)} calendar tasks for user_id: {token_data.user_id}")

    return tasks


@tasks_router.get("/{task_id}", response_model=TaskResponse)
def get_task_by_id(
    task_id: int,
    token_data: TokenData = Depends(verify_jwt_token),
    session: Session = Depends(get_session)
):
    """
    Get a specific task by its ID for the authenticated user.
    Validates ownership of the task.
    """
    logger.info(f"Fetching task_id: {task_id} for user_id: {token_data.user_id}")

    # Get the specific task
    task = session.get(Task, task_id)

    if not task:
        logger.warning(f"Task not found: {task_id}, user_id: {token_data.user_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Verify that the task belongs to the authenticated user
    if task.user_id != token_data.user_id:
        logger.warning(f"Unauthorized access attempt to task: {task_id}, user_id: {token_data.user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )

    logger.info(f"Task found and returned successfully: {task_id} for user_id: {token_data.user_id}")

    return task


