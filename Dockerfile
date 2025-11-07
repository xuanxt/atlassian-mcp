# Atlassian MCP Server - Docker Image
# Multi-stage build for optimal image size

# Stage 1: Build and dependencies
FROM oven/bun:1.3-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile --production

# Copy source code
COPY src ./src
COPY tsconfig.json* ./

# Stage 2: Runtime image
FROM oven/bun:1.3-alpine AS runtime

WORKDIR /app

# Install Node.js for tsx compatibility (required by MCP SDK)
RUN apk add --no-cache nodejs

# Copy dependencies and source from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src ./src

# Copy entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

# Create non-root user for security
RUN addgroup -g 1001 -S atlassian && \
    adduser -S -D -H -u 1001 -h /app -s /sbin/nologin -G atlassian -g atlassian atlassian && \
    chmod +x /app/docker-entrypoint.sh && \
    chown -R atlassian:atlassian /app

# Switch to non-root user
USER atlassian

# Set environment variables (can be overridden at runtime)
ENV NODE_ENV=production

# Expose stdio transport (MCP uses stdio, no network ports needed)
# Container will communicate via stdin/stdout

# Health check (verify the binary exists and is executable)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD [ "test", "-x", "/app/src/index.ts" ]

# Entry point
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Default command (show help if no args provided)
CMD []

# Metadata
LABEL org.opencontainers.image.title="Atlassian MCP Server"
LABEL org.opencontainers.image.description="Model Context Protocol server for Atlassian Confluence and Jira Cloud APIs"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="Atlassian MCP Contributors"
LABEL org.opencontainers.image.source="https://github.com/xuanxt/atlassian-mcp"
LABEL org.opencontainers.image.licenses="MIT"
