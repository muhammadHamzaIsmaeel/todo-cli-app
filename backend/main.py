if __name__ == "__main__":
    import uvicorn
    import os

    # Import the actual application from src.todo.main
    from src.todo.main import app

    # Get port from environment or default to 8000
    port = int(os.environ.get("PORT", 8000))

    # Run the application
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
