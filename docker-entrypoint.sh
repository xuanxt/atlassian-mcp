#!/bin/sh
# Docker entrypoint script for Atlassian MCP Server
# Handles config file resolution

set -e

# Default config file location inside container
CONFIG_FILE="/config/.atlassian-mcp.json"

# If no --config specified, try to find config at default location
has_config_arg=false
for arg in "$@"; do
    if [ "$arg" = "--config" ] || [ "$arg" = "-c" ]; then
        has_config_arg=true
        break
    fi
done

# If no --config argument and no environment variables, use default config location
if [ "$has_config_arg" = "false" ] && \
   [ -z "$ATLASSIAN_DOMAIN" ] && \
   [ -z "$ATLASSIAN_EMAIL" ] && \
   [ -z "$ATLASSIAN_API_TOKEN" ]; then

    if [ -f "$CONFIG_FILE" ]; then
        exec node /app/dist/index.js --config "$CONFIG_FILE" "$@"
    fi
fi

# Otherwise, use provided arguments
exec node /app/dist/index.js "$@"
