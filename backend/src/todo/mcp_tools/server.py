"""MCP Server for the AI Todo Chatbot"""
import asyncio
import logging
from mcp import server, stdio
from mcp.types import TextContent, Tool
from .task_tools import (
    add_task,
    list_tasks,
    update_task,
    delete_task,
    complete_task
)

logger = logging.getLogger(__name__)


async def main():
    """Start the MCP server with task tools"""
    logger.info("Starting MCP server for AI Todo Chatbot")

    async with server.stdio_server() as (read_stream, write_stream):
        # Register tools with the server
        await server.send_request(
            "tools/list",
            {
                "tools": [
                    {
                        "name": "add_task",
                        "description": "Add a new task for the user",
                        "input_schema": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "string", "description": "The ID of the user"},
                                "title": {"type": "string", "description": "The title of the task"},
                                "description": {"type": "string", "description": "Optional description of the task"}
                            },
                            "required": ["user_id", "title"]
                        }
                    },
                    {
                        "name": "list_tasks",
                        "description": "List tasks for the user",
                        "input_schema": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "string", "description": "The ID of the user"},
                                "status": {"type": "string", "description": "Filter by status: all, pending, completed"}
                            },
                            "required": ["user_id"]
                        }
                    },
                    {
                        "name": "update_task",
                        "description": "Update an existing task",
                        "input_schema": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "string", "description": "The ID of the user"},
                                "task_id": {"type": "string", "description": "The ID of the task to update"},
                                "title": {"type": "string", "description": "New title for the task (optional)"},
                                "description": {"type": "string", "description": "New description for the task (optional)"}
                            },
                            "required": ["user_id", "task_id"]
                        }
                    },
                    {
                        "name": "delete_task",
                        "description": "Delete a task",
                        "input_schema": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "string", "description": "The ID of the user"},
                                "task_id": {"type": "string", "description": "The ID of the task to delete"}
                            },
                            "required": ["user_id", "task_id"]
                        }
                    },
                    {
                        "name": "complete_task",
                        "description": "Mark a task as complete",
                        "input_schema": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "string", "description": "The ID of the user"},
                                "task_id": {"type": "string", "description": "The ID of the task to complete"}
                            },
                            "required": ["user_id", "task_id"]
                        }
                    }
                ]
            }
        )

        logger.info("MCP server registered tools successfully")

        # Handle tool calls
        async for request in read_stream:
            if request.method == "tools/call":
                tool_name = request.params["name"]
                arguments = request.params["arguments"]

                logger.info(f"MCP server received tool call: {tool_name} for user {arguments.get('user_id', 'unknown')}")

                try:
                    if tool_name == "add_task":
                        result = await add_task(**arguments)
                    elif tool_name == "list_tasks":
                        result = await list_tasks(**arguments)
                    elif tool_name == "update_task":
                        result = await update_task(**arguments)
                    elif tool_name == "delete_task":
                        result = await delete_task(**arguments)
                    elif tool_name == "complete_task":
                        result = await complete_task(**arguments)
                    else:
                        logger.warning(f"Unknown tool called: {tool_name}")
                        result = {"error": f"Unknown tool: {tool_name}"}

                    await server.send_response(
                        request.id,
                        {"result": result}
                    )

                    logger.info(f"MCP server completed tool call: {tool_name}")
                except Exception as e:
                    logger.error(f"Error in MCP server while executing {tool_name}: {str(e)}")
                    await server.send_response(
                        request.id,
                        {"error": str(e)}
                    )


if __name__ == "__main__":
    asyncio.run(main())