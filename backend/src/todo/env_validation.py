"""Environment variable validation for the AI Todo Chatbot"""
import os
import sys
from typing import List


def validate_required_env_vars() -> List[str]:
    """Validate that all required environment variables are set"""
    required_vars = [
        "OPENAI_API_KEY",
        "DATABASE_URL",
        "BETTER_AUTH_SECRET",
    ]

    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)

    return missing_vars


def check_optional_env_vars() -> List[str]:
    """Check for optional environment variables that enhance functionality"""
    optional_vars = [
        "NEXT_PUBLIC_OPENAI_DOMAIN_KEY",  # For ChatKit frontend
    ]

    missing_optional = []
    for var in optional_vars:
        if not os.getenv(var):
            missing_optional.append(var)

    return missing_optional


def validate_environment():
    """Validate the environment on startup"""
    print("Validating environment variables...")

    missing_required = validate_required_env_vars()
    if missing_required:
        print(f"❌ ERROR: Missing required environment variables: {', '.join(missing_required)}")
        print("Please set these variables before starting the application.")
        sys.exit(1)

    missing_optional = check_optional_env_vars()
    if missing_optional:
        print(f"⚠️  WARNING: Missing optional environment variables: {', '.join(missing_optional)}")
        print("The application will run but some features may not work properly.")

    print("✅ All required environment variables are set")