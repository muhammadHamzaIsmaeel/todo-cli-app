#!/bin/bash
PORT=${PORT:-8000}
echo "Starting server on port $PORT"
exec uvicorn src.todo.main:app --host 0.0.0.0 --port $PORT