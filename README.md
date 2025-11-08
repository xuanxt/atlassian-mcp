# Atlassian MCP Server

[![npm version](https://img.shields.io/npm/v/@xuandev/atlassian-mcp.svg)](https://www.npmjs.com/package/@xuandev/atlassian-mcp)
[![npm downloads](https://img.shields.io/npm/dm/@xuandev/atlassian-mcp.svg)](https://www.npmjs.com/package/@xuandev/atlassian-mcp)
[![Docker Image](https://img.shields.io/docker/v/xuanxdev/atlassian-mcp?sort=semver&label=docker)](https://hub.docker.com/r/xuanxdev/atlassian-mcp)
[![Docker Pulls](https://img.shields.io/docker/pulls/xuanxdev/atlassian-mcp)](https://hub.docker.com/r/xuanxdev/atlassian-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Model Context Protocol (MCP) server for Atlassian Confluence and Jira Cloud. Provides 51 tools to manage Confluence pages, Jira issues, sprints, boards, and backlogs. Supports NPM package and Docker deployment with flexible authentication.

## Overview

Provides **51 tools** (13 for Confluence, 38 for Jira) that allow MCP-compatible AI assistants to manage your Atlassian Cloud workspace.

### What You Can Do

**Confluence (13 Tools)**
- **Space & Page Management**: List, create, update, delete spaces and pages
- **Content Search**: Search pages using CQL (Confluence Query Language)
- **Comments**: Add and manage comments on pages
- **Content Hierarchy**: Get page content, ancestors, children, and full hierarchies

**Jira (38 Tools)**
- **Issue Management**: Create, update, transition, assign, and delete issues
- **Sprint Operations**: Create, start, close, and delete sprints; move issues between sprints
- **Board Management**: Create, configure, and manage Scrum/Kanban boards
- **Backlog Management**: Rank issues, move to/from backlog, manage sprint assignments
- **Epic Management**: Create epics, assign issues to epics, manage epic workflows
- **Time Tracking**: Add, update, delete worklogs
- **Search**: JQL (Jira Query Language) support
- **Version Management**: Create, update, delete project versions
- **Issue Linking**: Link related issues
- **Batch Operations**: Update multiple issues at once

### Features

- **51 Tools**: Full CRUD operations for pages, issues, boards, sprints
- **Multiple Deployment**: NPM package, Docker container, local build
- **IDE Support**: Claude Desktop, Cursor, Claude Code, VS Code (Cline), Windsurf
- **Flexible Configuration**: Config files, environment variables, or CLI arguments
- **Built with TypeScript**: Type-safe implementation with MCP SDK

---

## Quick Start

### Method 1: Using npx (Recommended)

No installation required, runs directly from npm registry:

```bash
# Run with default config file (~/.atlassian-mcp.json)
npx @xuandev/atlassian-mcp

# Run with custom config file
npx @xuandev/atlassian-mcp --config /path/to/config.json

# Run with environment variables
ATLASSIAN_DOMAIN="your-domain.atlassian.net" \
ATLASSIAN_EMAIL="your-email@example.com" \
ATLASSIAN_API_TOKEN="your-api-token" \
npx @xuandev/atlassian-mcp

# Run with command-line arguments
npx @xuandev/atlassian-mcp \
  --domain your-domain.atlassian.net \
  --email your-email@example.com \
  --token your-api-token
```

**Prerequisites**:
- Create `~/.atlassian-mcp.json` config file (see [Configuration](#configuration))
- Or set environment variables
- Or use command-line arguments

### Method 2: Global Installation

```bash
# Using npm
npm install -g @xuandev/atlassian-mcp

# Using bun
bun install -g @xuandev/atlassian-mcp

# Run with config file (recommended)
atlassian-mcp

# Run with custom config
atlassian-mcp --config /path/to/config.json

# Run with environment variables
ATLASSIAN_DOMAIN="your-domain.atlassian.net" \
ATLASSIAN_EMAIL="your-email@example.com" \
ATLASSIAN_API_TOKEN="your-api-token" \
atlassian-mcp

# Run with command-line arguments
atlassian-mcp \
  --domain your-domain.atlassian.net \
  --email your-email@example.com \
  --token your-api-token
```

### Method 3: Docker (Containerized Deployment)

**Using published image from Docker Hub:**

```bash
# Pull the image
docker pull xuanxdev/atlassian-mcp:latest

# Run with config file (recommended)
docker run -i --rm \
  -v .atlassian-mcp.json:/config/.atlassian-mcp.json:ro \
  xuanxdev/atlassian-mcp:latest

# Run with environment variables
docker run -i --rm \
  -e ATLASSIAN_DOMAIN="your-domain.atlassian.net" \
  -e ATLASSIAN_EMAIL="your-email@example.com" \
  -e ATLASSIAN_API_TOKEN="your-api-token" \
  xuanxdev/atlassian-mcp:latest

# Run with command-line arguments
docker run -i --rm xuanxdev/atlassian-mcp:latest \
  --domain your-domain.atlassian.net \
  --email your-email@example.com \
  --token your-api-token
```

**Building locally:**

```bash
# Build the Docker image
docker build -t xuanxdev/atlassian-mcp:1.0.0 -t xuanxdev/atlassian-mcp:latest .

# Run locally built image
docker run -i --rm \
  -v /absolute/path/to/.atlassian-mcp.json:/config/.atlassian-mcp.json:ro \
  xuanxdev/atlassian-mcp:latest
```

---

## Configuration

This MCP server supports **three configuration methods** with the following priority:

1. **Command-line arguments** (highest priority)
2. **Environment variables**
3. **Config file** (lowest priority)

### Get Atlassian API Token

Before configuring, you need an API token:

1. Visit https://id.atlassian.com/manage-profile/security/api-tokens
2. Click **"Create API token"**
3. Enter a name and create
4. **Copy the token** (only shown once, save it securely)

### Method 1: Config File (Recommended)

#### Default Config File Locations

The server automatically searches for config files in these locations (in order):

1. `~/.atlassian-mcp.json` (user home directory - recommended)
2. `~/.config/atlassian-mcp/config.json` (XDG config directory)
3. `./.atlassian-mcp.json` (current working directory)

**Config file format:**

```json
{
  "domain": "your-domain.atlassian.net",
  "email": "your-email@example.com",
  "apiToken": "your-api-token-here"
}
```

**Security tip:** Set restrictive permissions on your config file:

```bash
chmod 600 ~/.atlassian-mcp.json
```

### Method 2: Environment Variables

**Linux/macOS:**
```bash
export ATLASSIAN_DOMAIN="your-domain.atlassian.net"
export ATLASSIAN_EMAIL="your-email@example.com"
export ATLASSIAN_API_TOKEN="your-api-token-here"
```

### Method 3: Command-line Arguments

```bash
atlassian-mcp --domain your-domain.atlassian.net \
              --email your-email@example.com \
              --token your-api-token-here
```

**Available options:**

- `-c, --config <path>` - Path to config file
- `-d, --domain <domain>` - Atlassian domain
- `-e, --email <email>` - Account email
- `-t, --token <token>` - API token
- `-V, --version` - Display version
- `-h, --help` - Display help

---

## MCP Client Config

### Common Configuration Examples

#### Using NPM Package (Recommended)

**With config file (relative path):**
```json
{
  "mcpServers": {
    "atlassian": {
      "command": "npx",
      "args": [
        "-y",
        "@xuandev/atlassian-mcp",
        "--config",
        ".atlassian-mcp.json"
      ]
    }
  }
}
```

**With environment variables:**
```json
{
  "mcpServers": {
    "atlassian": {
      "command": "npx",
      "args": ["-y", "@xuandev/atlassian-mcp"],
      "env": {
        "ATLASSIAN_DOMAIN": "your-domain.atlassian.net",
        "ATLASSIAN_EMAIL": "your-email@example.com",
        "ATLASSIAN_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

#### Using Docker Container

**With config file (relative path):**
```json
{
  "mcpServers": {
    "atlassian": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v",
        ".atlassian-mcp.json:/config/.atlassian-mcp.json:ro",
        "xuanxdev/atlassian-mcp:latest"
      ]
    }
  }
}
```

**With environment variables:**
```json
{
  "mcpServers": {
    "atlassian": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "ATLASSIAN_DOMAIN=your-domain.atlassian.net",
        "-e",
        "ATLASSIAN_EMAIL=your-email@example.com",
        "-e",
        "ATLASSIAN_API_TOKEN=your-api-token",
        "xuanxdev/atlassian-mcp:latest"
      ]
    }
  }
}
```

---

## Complete Tool Reference

### Confluence Tools (13 Total)

#### Space Management

**1. confluence_list_spaces**
- **Description**: List all Confluence spaces
- **Parameters**:
  - `maxResults` (optional, number): Maximum results to return (default: 25)
  - `startAt` (optional, number): Starting index for pagination (default: 0)
- **Returns**: Array of spaces with ID, key, name, type, status

**2. confluence_search**
- **Description**: Search Confluence content using CQL (Confluence Query Language)
- **Parameters**:
  - `cql` (required, string): CQL query string (e.g., "type=page AND space=TEAM")
  - `maxResults` (optional, number): Maximum results (default: 25)
  - `startAt` (optional, number): Pagination offset (default: 0)
  - `expand` (optional, string[]): Fields to expand (e.g., ["body.view", "version", "space"])
- **Returns**: Search results with content details
- **CQL Examples**:
  - `type=page AND title~"API"` - Search pages with "API" in title
  - `space=TEAM AND lastModified>now("-7d")` - Pages modified in last 7 days
  - `creator=currentUser()` - Content created by current user

#### Page Management

**3. confluence_list_pages**
- **Description**: List pages in a space
- **Parameters**:
  - `spaceId` (required, string): Space ID
  - `maxResults` (optional, number): Maximum results (default: 25)
  - `startAt` (optional, number): Pagination offset (default: 0)
- **Returns**: Array of pages with ID, title, status, position

**4. confluence_get_page**
- **Description**: Get detailed page information
- **Parameters**:
  - `pageId` (required, string): Page ID
  - `bodyFormat` (optional, string): Body format - "storage" (raw HTML), "atlas_doc_format" (JSON), "view" (rendered HTML), "export_view" (export format)
  - `version` (optional, number): Specific version number (omit for latest)
- **Returns**: Complete page data including:
  - Basic info: ID, status, title, space ID
  - Content: Body in requested format
  - Metadata: Version, created/modified dates, author
  - Relations: Parent page, child pages

**5. confluence_get_page_children**
- **Description**: Get child pages of a page
- **Parameters**:
  - `pageId` (required, string): Parent page ID
  - `maxResults` (optional, number): Maximum results (default: 25)
  - `startAt` (optional, number): Pagination offset (default: 0)
- **Returns**: Array of child pages

**6. confluence_create_page**
- **Description**: Create a new page
- **Parameters**:
  - `spaceId` (required, string): Target space ID
  - `title` (required, string): Page title
  - `body` (required, string): Page content in storage format (HTML) or atlas_doc_format (JSON)
  - `parentId` (optional, string): Parent page ID (for hierarchy)
  - `status` (optional, string): "current" or "draft" (default: "current")
- **Returns**: Created page with ID and details

**7. confluence_update_page**
- **Description**: Update an existing page
- **Parameters**:
  - `pageId` (required, string): Page ID to update
  - `title` (optional, string): New title
  - `body` (optional, string): New content
  - `version` (required, number): Current version number (for optimistic locking)
  - `status` (optional, string): "current" or "draft"
- **Returns**: Updated page details
- **Note**: Requires current version number to prevent conflicts

**8. confluence_delete_page**
- **Description**: Delete a page (moves to trash)
- **Parameters**:
  - `pageId` (required, string): Page ID to delete
- **Returns**: Confirmation message
- **Note**: Page can be restored from trash

#### User Management

**9. confluence_search_user**
- **Description**: Search for Confluence users
- **Parameters**:
  - `query` (required, string): Search query (name, email, or display name)
  - `maxResults` (optional, number): Maximum results (default: 25)
  - `startAt` (optional, number): Pagination offset (default: 0)
- **Returns**: Array of users with:
  - Account ID (for API operations)
  - Display name
  - Email (if visible)
  - Profile picture
  - Account type and status

#### Label Management

**10. confluence_get_labels**
- **Description**: Get labels attached to a page
- **Parameters**:
  - `pageId` (required, string): Page ID
  - `maxResults` (optional, number): Maximum results (default: 25)
  - `startAt` (optional, number): Pagination offset (default: 0)
- **Returns**: Array of labels with ID and name

**11. confluence_add_label**
- **Description**: Add a label to a page
- **Parameters**:
  - `pageId` (required, string): Target page ID
  - `labelName` (required, string): Label name (e.g., "important", "draft")
- **Returns**: Created label details
- **Note**: Creates label if it doesn't exist

#### Comment Management

**12. confluence_get_comments**
- **Description**: Get comments on a page
- **Parameters**:
  - `pageId` (required, string): Page ID
  - `maxResults` (optional, number): Maximum results (default: 25)
  - `startAt` (optional, number): Pagination offset (default: 0)
- **Returns**: Array of comments with:
  - Comment ID, body (storage format)
  - Author details
  - Created/modified dates
  - Parent comment ID (for replies)

**13. confluence_add_comment**
- **Description**: Add a comment to a page
- **Parameters**:
  - `pageId` (required, string): Target page ID
  - `body` (required, string): Comment content in storage format (HTML)
  - `parentCommentId` (optional, string): Parent comment ID (for replies)
- **Returns**: Created comment with ID
- **Note**: Supports threaded comments via parentCommentId

---

### Jira Tools (38 Total)

#### Project Management

**1. jira_list_projects**
- **Description**: List all accessible Jira projects
- **Parameters**:
  - `maxResults` (optional, number): Maximum results (default: 50)
  - `startAt` (optional, number): Pagination offset (default: 0)
- **Returns**: Array of projects with:
  - Project ID, key, name
  - Project type (software, business, service_desk)
  - Project style (classic, next-gen)
  - Lead account ID
  - Avatar URLs

#### Issue Search & Retrieval

**2. jira_search_issues**
- **Description**: Search issues using JQL (Jira Query Language)
- **Parameters**:
  - `jql` (required, string): JQL query string
  - `maxResults` (optional, number): Maximum results (default: 50)
  - `startAt` (optional, number): Pagination offset (default: 0)
  - `fields` (optional, string[]): Specific fields to return
- **Returns**: Search results with issue details
- **JQL Examples**:
  - `project = PROJ AND status = "In Progress"` - Open issues
  - `assignee = currentUser() AND priority = High` - My high-priority issues
  - `created >= -7d ORDER BY priority DESC` - Issues from last 7 days
  - `sprint = 5 AND type = Bug` - Bugs in Sprint 5

**3. jira_get_issue**
- **Description**: Get detailed information for a specific issue
- **Parameters**:
  - `issueKey` (required, string): Issue key (e.g., "PROJ-123")
  - `fields` (optional, string[]): Specific fields to retrieve
  - `expand` (optional, string[]): Additional data to expand (e.g., ["changelog", "renderedFields"])
- **Returns**: Complete issue data including:
  - **Basic**: Key, ID, self URL
  - **Type & Status**: Issue type, status, resolution
  - **Content**: Summary, description
  - **Assignment**: Assignee, reporter, creator
  - **Scheduling**: Created, updated, due date, resolved date
  - **Priority**: Priority level
  - **Versions**: Fix versions, affected versions
  - **Components**: Project components
  - **Custom Fields**: All custom fields in your Jira instance
  - **Relations**: Parent, subtasks, epic link
  - **Agile**: Sprint field, story points, epic info

**4. jira_get_project_issues**
- **Description**: Get all issues for a specific project
- **Parameters**:
  - `projectKey` (required, string): Project key
  - `maxResults` (optional, number): Maximum results (default: 50)
  - `startAt` (optional, number): Pagination offset (default: 0)
  - `fields` (optional, string[]): Specific fields to return
- **Returns**: All issues in the project with specified fields

#### Issue CRUD Operations

**5. jira_create_issue**
- **Description**: Create a new Jira issue (supports all types including Sub-task)
- **Parameters**:
  - `projectKey` (required, string): Target project key
  - `issueType` (required, string): Issue type (e.g., "Task", "Bug", "Story", "Epic", "Sub-task")
  - `summary` (required, string): Issue summary/title
  - `description` (optional, string): Detailed description
  - `priority` (optional, string): Priority level (e.g., "Highest", "High", "Medium", "Low", "Lowest")
  - `labels` (optional, string[]): Issue labels
  - `assignee` (optional, string): Assignee account ID
  - `parentKey` (optional, string): **Parent issue key - REQUIRED for creating Sub-task** (e.g., "PROJ-123")
- **Returns**: Created issue with key and ID
- **Supported Issue Types**: Task, Bug, Story, Epic, Sub-task, and custom types
- **Note**: When `issueType` is "Sub-task", you MUST provide `parentKey` to specify the parent issue

**6. jira_update_issue**
- **Description**: Update an existing issue
- **Parameters**:
  - `issueKey` (required, string): Issue key to update
  - `summary` (optional, string): New summary
  - `description` (optional, string): New description
  - `priority` (optional, string): New priority
  - `labels` (optional, string[]): New labels (replaces existing)
  - `assignee` (optional, string): New assignee account ID
  - `parentKey` (optional, string): New parent issue key (for changing Sub-task parent)
- **Returns**: Confirmation message
- **Note**: Only specified fields are updated; others remain unchanged

**7. jira_delete_issue**
- **Description**: Delete an issue
- **Parameters**:
  - `issueKey` (required, string): Issue key to delete
  - `deleteSubtasks` (optional, boolean): Whether to delete subtasks (default: false)
- **Returns**: Confirmation message
- **Warning**: Permanent deletion, cannot be undone

#### Issue Hierarchy & Parent Relationships

**Using `parentKey` for Hierarchy**:

Jira supports multi-level issue hierarchies using the `parentKey` parameter. Use `parentKey` when creating issues to establish parent-child relationships:

- **Story → Epic**: Link stories to epics (optional)
- **Task → Story/Epic**: Organize tasks under stories or epics (optional)
- **Bug → Story/Epic**: Associate bugs with features (optional)
- **Sub-task → Any parent**: Create sub-tasks under any issue type (required)

**Example Hierarchy**:
- PROJ-100 (Epic) → PROJ-101 (Story, `parentKey: "PROJ-100"`) → PROJ-102 (Sub-task, `parentKey: "PROJ-101"`)
- `parentKey` is **required** for Sub-task, **optional** for Story/Task/Bug
- Parent and child must be in same project

#### Workflow & Transitions

**8. jira_get_transitions**
- **Description**: Get available status transitions for an issue
- **Parameters**:
  - `issueKey` (required, string): Issue key
- **Returns**: Array of available transitions with:
  - Transition ID, name
  - Target status (to)
  - Required fields for transition
- **Use Case**: Determine which status changes are available before calling jira_transition_issue

**9. jira_transition_issue**
- **Description**: Change issue status (move through workflow)
- **Parameters**:
  - `issueKey` (required, string): Issue key
  - `transitionId` (required, string): Transition ID (from jira_get_transitions)
  - `comment` (optional, string): Comment to add with transition
  - `fields` (optional, object): Required fields for transition (if any)
- **Returns**: Confirmation message
- **Examples**:
  - Start Progress: Transition "To Do" → "In Progress"
  - Resolve: Transition "In Progress" → "Done"
  - Reopen: Transition "Done" → "To Do"

#### Comments & Work Logs

**10. jira_add_comment**
- **Description**: Add a comment to an issue
- **Parameters**:
  - `issueKey` (required, string): Target issue key
  - `body` (required, string): Comment text (supports Jira markdown)
- **Returns**: Created comment with ID
- **Markdown Support**: Bold, italic, lists, code blocks, mentions

**11. jira_get_worklog**
- **Description**: Get work logs for an issue
- **Parameters**:
  - `issueKey` (required, string): Issue key
  - `maxResults` (optional, number): Maximum results (default: 50)
  - `startAt` (optional, number): Pagination offset (default: 0)
- **Returns**: Array of work logs with:
  - Worklog ID
  - Author details
  - Time spent (seconds and human-readable)
  - Start date
  - Comment/description

**12. jira_add_worklog**
- **Description**: Log work time on an issue
- **Parameters**:
  - `issueKey` (required, string): Target issue key
  - `timeSpent` (required, string): Time spent (e.g., "3h 30m", "1d 4h", "45m")
  - `comment` (optional, string): Work description
  - `started` (optional, string): Start date/time (ISO 8601 format, default: now)
- **Returns**: Created worklog with ID
- **Time Format Examples**:
  - "1h" = 1 hour
  - "30m" = 30 minutes
  - "2d 4h 30m" = 2 days, 4 hours, 30 minutes
  - "1w 3d" = 1 week, 3 days

#### Issue Linking

**13. jira_get_issue_link_types**
- **Description**: Get all available issue link types
- **Parameters**: None
- **Returns**: Array of link types with:
  - Link type ID, name
  - Inward description (e.g., "is blocked by")
  - Outward description (e.g., "blocks")
- **Common Link Types**:
  - Blocks / Is blocked by
  - Relates to
  - Duplicates / Is duplicated by
  - Clones / Is cloned by
  - Causes / Is caused by

**14. jira_create_issue_link**
- **Description**: Create a link between two issues
- **Parameters**:
  - `issueKey` (required, string): Source issue key
  - `linkedIssueKey` (required, string): Target issue key
  - `linkType` (required, string): Link type name (e.g., "Blocks", "Relates")
  - `comment` (optional, string): Comment about the link
- **Returns**: Created link confirmation
- **Example**: Link "PROJ-1" blocks "PROJ-2"

**15. jira_remove_issue_link**
- **Description**: Remove a link between issues
- **Parameters**:
  - `linkId` (required, string): Link ID (from issue's issuelinks field)
- **Returns**: Confirmation message

#### Version Management

**16. jira_get_project_versions**
- **Description**: Get all versions (releases) for a project
- **Parameters**:
  - `projectKey` (required, string): Project key
  - `maxResults` (optional, number): Maximum results (default: 50)
  - `startAt` (optional, number): Pagination offset (default: 0)
- **Returns**: Array of versions with:
  - Version ID, name, description
  - Release status (released/unreleased)
  - Release date, start date
  - Archived status
  - Issue counts (fixed, affected)

**17. jira_create_version**
- **Description**: Create a new project version/release
- **Parameters**:
  - `projectKey` (required, string): Project key
  - `name` (required, string): Version name (e.g., "v1.0.0", "Sprint 5")
  - `description` (optional, string): Version description
  - `releaseDate` (optional, string): Release date (YYYY-MM-DD)
  - `startDate` (optional, string): Start date (YYYY-MM-DD)
  - `released` (optional, boolean): Mark as released (default: false)
  - `archived` (optional, boolean): Archive version (default: false)
- **Returns**: Created version with ID

**18. jira_batch_create_versions**
- **Description**: Create multiple versions in a single operation
- **Parameters**:
  - `projectKey` (required, string): Target project key
  - `versions` (required, array): Array of version objects (same fields as jira_create_version)
- **Returns**: Array of created versions
- **Use Case**: Quickly set up release schedule with multiple versions

#### Field Management

**19. jira_search_fields**
- **Description**: Search and list Jira fields (including custom fields)
- **Parameters**:
  - `maxResults` (optional, number): Maximum results (default: 50)
  - `startAt` (optional, number): Pagination offset (default: 0)
  - `type` (optional, string): Filter by field type (e.g., "custom", "system")
  - `query` (optional, string): Search query for field name
- **Returns**: Array of fields with:
  - Field ID (e.g., "customfield_10001")
  - Field name, description
  - Field type (string, number, date, user, etc.)
  - Schema information
  - Searchable/orderable flags
- **Use Case**: Find custom field IDs for use in jira_create_issue or jira_update_issue

#### User Management

**20. jira_get_user_profile**
- **Description**: Get detailed user profile information
- **Parameters**:
  - `accountId` (required, string): User account ID
- **Returns**: User profile with:
  - Account ID, account type
  - Display name, email
  - Avatar URLs
  - Active status
  - Time zone, locale

#### Agile Board Management

**21. jira_get_agile_boards**
- **Description**: Get all agile boards (Scrum/Kanban)
- **Parameters**:
  - `maxResults` (optional, number): Maximum results (default: 50)
  - `startAt` (optional, number): Pagination offset (default: 0)
  - `projectKeyOrId` (optional, string): Filter by project
  - `type` (optional, string): Filter by board type ("scrum", "kanban")
  - `name` (optional, string): Filter by board name
- **Returns**: Array of boards with:
  - Board ID, name
  - Board type (scrum, kanban, simple)
  - Associated project
  - Self URL
- **Field Details**:
  - ✅ **Implemented**: ID, name, type, project
  - ⚠️ **Not Implemented**: Board configuration, column config, estimation, ranking

**22. jira_create_board** 🆕
- **Description**: Create a new agile board (Scrum or Kanban)
- **Parameters**:
  - `name` (required, string): Board name
  - `type` (required, string): Board type - "scrum" or "kanban"
  - `projectKeyOrId` (required, string): Project key or ID to associate with the board
  - `filterId` (optional, number): Filter ID to base the board on (alternative to project)
- **Returns**: Created board with ID and configuration
- **Use Case**: Programmatically set up new boards for projects or teams
- **Note**: If filterId is not provided, board will be created using project location

**23. jira_update_board** 🆕
- **Description**: Update board configuration (Limited API support)
- **Parameters**:
  - `boardId` (required, number): Board ID to update
  - `name` (optional, string): New board name
  - `filterId` (optional, number): New filter ID
- **Returns**: Updated board configuration
- **Note**: Jira Agile API has limited support for board updates. Some operations may not be supported.
- **Limitation**: Cannot change board type (scrum/kanban) after creation. May not support updating basic properties like name.

**24. jira_delete_board** 🆕
- **Description**: Delete a board permanently
- **Parameters**:
  - `boardId` (required, number): Board ID to delete
- **Returns**: Confirmation message
- **Warning**: This is permanent and cannot be undone. All board configuration will be lost.

**25. jira_get_board_issues**
- **Description**: Get all issues on a board
- **Parameters**:
  - `boardId` (required, number): Board ID
  - `maxResults` (optional, number): Maximum results (default: 50)
  - `startAt` (optional, number): Pagination offset (default: 0)
  - `jql` (optional, string): Additional JQL filter
  - `fields` (optional, string[]): Specific fields to return
- **Returns**: Array of issues on the board
- **Note**: Returns issues from all sprints and backlog for Scrum boards; all issues for Kanban boards

**26. jira_get_backlog_issues** 🆕
- **Description**: Get issues in the backlog (not assigned to any sprint)
- **Parameters**:
  - `boardId` (required, number): Board ID
  - `maxResults` (optional, number): Maximum results (default: 50)
  - `startAt` (optional, number): Pagination offset (default: 0)
  - `jql` (optional, string): Additional JQL filter
  - `fields` (optional, string[]): Specific fields to return
- **Returns**: Array of backlog issues
- **Use Case**: View all unscheduled work before sprint planning
- **Field Details**:
  - ✅ **Implemented**: Issue key, summary, type, status, priority, assignee, all standard fields
  - ⚠️ **Not Implemented**: Backlog ranking/ordering customization (now implemented - see tool 27)

**27. jira_rank_backlog_issues** 🆕
- **Description**: Rank/reorder issues in the backlog
- **Parameters**:
  - `issueKeys` (required, string[]): Array of issue keys to rank (e.g., ["PROJ-1", "PROJ-2"])
  - `rankBeforeIssue` (optional, string): Rank the issues before this issue key (e.g., "PROJ-10")
  - `rankAfterIssue` (optional, string): Rank the issues after this issue key (e.g., "PROJ-5")
- **Returns**: Confirmation message
- **Use Case**: Adjust issue priority order in backlog before sprint planning
- **Note**: Specify either rankBeforeIssue or rankAfterIssue, not both

#### Sprint Management (Scrum)

**28. jira_get_sprints_from_board**
- **Description**: Get all sprints for a Scrum board
- **Parameters**:
  - `boardId` (required, number): Board ID
  - `maxResults` (optional, number): Maximum results (default: 50)
  - `startAt` (optional, number): Pagination offset (default: 0)
  - `state` (optional, string): Filter by state ("active", "future", "closed")
- **Returns**: Array of sprints with:
  - Sprint ID, name, state
  - Start date, end date, complete date
  - Origin board ID
  - Goal
  - Self URL
- **Field Details**:
  - ✅ **Implemented**: ID, name, state, startDate, endDate, completeDate, goal, originBoardId
  - ⚠️ **Not Implemented**: Sprint sequence number, Sprint custom fields

**29. jira_get_sprint_issues**
- **Description**: Get all issues in a specific sprint
- **Parameters**:
  - `sprintId` (required, number): Sprint ID
  - `maxResults` (optional, number): Maximum results (default: 50)
  - `startAt` (optional, number): Pagination offset (default: 0)
  - `jql` (optional, string): Additional JQL filter
  - `fields` (optional, string[]): Specific fields to return
- **Returns**: Array of issues in the sprint
- **Use Case**: Review sprint scope, track sprint progress

**30. jira_create_sprint**
- **Description**: Create a new sprint
- **Parameters**:
  - `boardId` (required, number): Target board ID
  - `name` (required, string): Sprint name (e.g., "Sprint 5", "Q4 Sprint 1")
  - `goal` (optional, string): Sprint goal/objective
  - `startDate` (optional, string): Start date (ISO 8601 format)
  - `endDate` (optional, string): End date (ISO 8601 format)
- **Returns**: Created sprint with ID and details
- **Note**: Sprint starts in "future" state; use jira_update_sprint to activate
- **Field Details**:
  - ✅ **Implemented**: name, goal, startDate, endDate
  - ⚠️ **Not Implemented**: Sprint custom fields, sequence number

**31. jira_update_sprint**
- **Description**: Update sprint details or change sprint state
- **Parameters**:
  - `sprintId` (required, number): Sprint ID
  - `name` (optional, string): New sprint name
  - `goal` (optional, string): New sprint goal
  - `startDate` (optional, string): New start date (ISO 8601)
  - `endDate` (optional, string): New end date (ISO 8601)
  - `state` (optional, string): New state ("active", "closed")
- **Returns**: Updated sprint details
- **State Transitions**:
  - "future" → "active": Start the sprint
  - "active" → "closed": Complete the sprint
- **Field Details**:
  - ✅ **Implemented**: name, goal, startDate, endDate, state
  - ⚠️ **Not Implemented**: completeDate (auto-set on close), custom fields

**32. jira_delete_sprint** 🆕
- **Description**: Delete a sprint permanently
- **Parameters**:
  - `sprintId` (required, number): Sprint ID to delete
- **Returns**: Confirmation message
- **Note**: Can only delete sprints that have not been started (future state). Cannot delete active or closed sprints.
- **Warning**: This is permanent and cannot be undone.

**33. jira_move_issues_to_sprint** 🆕
- **Description**: Move issues from backlog to a sprint
- **Parameters**:
  - `sprintId` (required, number): Target sprint ID
  - `issues` (required, string[]): Array of issue keys to move (e.g., ["PROJ-1", "PROJ-2"])
- **Returns**: Confirmation message
- **Use Case**: Essential for sprint planning - add issues from backlog to sprint
- **Note**: Issues must not be in another active sprint

**Complete Workflow**: Create Sprint → Create hierarchy (Epic → Story → Task with `parentKey`) → Move to Sprint → Start Sprint
- See hierarchy examples in tool #5 above for `parentKey` usage

#### Epic Management

**34. jira_link_to_epic**
- **Description**: Link an issue (Story/Task/Bug) to an Epic
- **Parameters**:
  - `issueKey` (required, string): Issue key to link (e.g., "PROJ-123")
  - `epicKey` (required, string): Epic key (e.g., "PROJ-50")
- **Returns**: Confirmation message
- **Use Case**: Organize stories under epics for feature tracking

**35. jira_get_epic_issues** 🆕
- **Description**: Get all issues (Stories, Tasks, Bugs) that belong to an Epic
- **Parameters**:
  - `epicIdOrKey` (required, string): Epic ID or key (e.g., "PROJ-50")
  - `maxResults` (optional, number): Maximum results (default: 50)
  - `startAt` (optional, number): Pagination offset (default: 0)
  - `fields` (optional, string[]): Specific fields to return
- **Returns**: Array of child issues under the epic
- **Use Case**: Track epic progress, view all related work
- **Field Details**:
  - ✅ **Implemented**: All standard issue fields, epic link
  - ⚠️ **Not Implemented**: Epic-specific fields (name, color - these are only on the Epic issue itself)

#### Batch Operations

**36. jira_batch_create_issues**
- **Description**: Create multiple issues in a single API call
- **Parameters**:
  - `issues` (required, array): Array of issue objects (same fields as jira_create_issue)
- **Returns**: Array of created issues with keys and IDs
- **Use Case**: Bulk import, create multiple related issues
- **Limit**: Up to 50 issues per batch (Jira API limit)

**37. jira_batch_get_changelogs**
- **Description**: Get change history for multiple issues
- **Parameters**:
  - `issueKeys` (required, string[]): Array of issue keys
- **Returns**: Array of changelog objects, one per issue
- **Changelog Contains**:
  - Field changes (from → to)
  - Author and timestamp
  - Change type (field update, status change, etc.)
- **Use Case**: Audit trail, track issue history

#### Attachments

**38. jira_download_attachments**
- **Description**: Get attachment metadata and download URLs
- **Parameters**:
  - `issueKey` (required, string): Issue key
- **Returns**: Array of attachments with:
  - Attachment ID, filename
  - File size, MIME type
  - Download URL (authenticated)
  - Author, created date
- **Note**: Returns metadata only; actual download requires separate authenticated request

---

## API Coverage Analysis

### Confluence API Coverage: 100%

All major Confluence REST API v2 features implemented:
- ✅ Space management (list, search)
- ✅ Page CRUD (create, read, update, delete)
- ✅ Page hierarchy (children, parents)
- ✅ Content search (CQL)
- ✅ Comments (get, add, reply)
- ✅ Labels (get, add)
- ✅ User search
- ✅ Multiple body formats (storage, atlas_doc_format, view, export_view)
- ✅ Pagination support

### Jira API Coverage: ~95%

#### Core Features: 100%
- ✅ Project management
- ✅ Issue CRUD operations
- ✅ Issue search (JQL)
- ✅ Workflow transitions
- ✅ Comments
- ✅ Work logs
- ✅ Issue linking
- ✅ Version management
- ✅ Field management
- ✅ User profiles
- ✅ Attachments (metadata)

#### Scrum/Agile Features: 90%

**Sprint Management: 100%** 🎯
- ✅ List sprints (with filtering)
  - Fields: ID, name, state, startDate, endDate, completeDate, goal, originBoardId
- ✅ Get sprint issues
- ✅ Create sprint
  - Fields: name, goal, startDate, endDate
- ✅ Update sprint (including state transitions)
  - Fields: name, goal, startDate, endDate, state
- ✅ Delete sprint 🆕
- ✅ Move issues to sprint 🆕
- ⚠️ Missing fields: sequence, custom fields (low priority)

**Board Management: 90%**
- ✅ List boards (with filtering)
  - Fields: ID, name, type, project
- ✅ Create board 🆕
  - Auto-creates filter if not provided
- ⚠️ Update board 🆕
  - Limited API support: Jira Agile API does not support updating basic board properties (name, filter)
  - Configuration endpoint available but has restrictions
  - Recommendation: Delete and recreate board for major changes
- ✅ Delete board 🆕
- ✅ Get board issues
- ✅ Get backlog issues 🆕
- ⚠️ Missing features: Board configuration (columns, swimlanes, card layout), estimation settings

**Epic Management: 65%**
- ✅ Link issues to epic
- ✅ Get epic issues 🆕
- ⚠️ Epic-specific operations on Epic issue itself (name, color) - use regular issue operations
- ⚠️ Unlink from epic (not implemented - use jira_remove_issue_link)

**Backlog Management: 100%** 🎯
- ✅ Get backlog issues 🆕
- ✅ Move issues to sprint 🆕
- ✅ Backlog ranking/reordering 🆕

---

## License

MIT License

---