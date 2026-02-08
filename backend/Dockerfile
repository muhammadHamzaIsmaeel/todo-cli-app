FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 8000

# Create a startup script to handle PORT environment variable
RUN echo '#!/bin/bash\nPORT=${PORT:-8000}\nexec uvicorn src.todo.main:app --host 0.0.0.0 --port $PORT' > /start.sh
RUN chmod +x /start.sh

# Run the application
CMD ["/start.sh"]