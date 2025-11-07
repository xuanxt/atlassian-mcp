/**
 * Jira MCP tools definitions
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { JiraAPI } from "./api.js";

export const jiraTools: Tool[] = [
  {
    name: "jira_list_projects",
    description:
      "List all Jira projects accessible to the user. Returns project keys, names, and types.",
    inputSchema: {
      type: "object",
      properties: {
        maxResults: {
          type: "number",
          description: "Maximum number of projects to return (default: 50)",
        },
        startAt: {
          type: "number",
          description: "Starting index for pagination (default: 0)",
        },
      },
    },
  },
  {
    name: "jira_search_issues",
    description:
      "Search for Jira issues using JQL (Jira Query Language). Returns issue keys, summaries, and fields.",
    inputSchema: {
      type: "object",
      properties: {
        jql: {
          type: "string",
          description: "JQL query string (e.g., 'project = PROJ AND status = Open')",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of issues to return (default: 50, max: 5000)",
        },
        nextPageToken: {
          type: "string",
          description: "Token for pagination to get next page of results",
        },
        fields: {
          type: "array",
          items: { type: "string" },
          description:
            "Specific fields to return (default: summary, status, assignee, created, updated)",
        },
      },
      required: ["jql"],
    },
  },
  {
    name: "jira_create_issue",
    description: "Create a new Jira issue. Requires project key, issue type, and summary.",
    inputSchema: {
      type: "object",
      properties: {
        projectKey: {
          type: "string",
          description: "The key of the project (e.g., 'PROJ')",
        },
        issueType: {
          type: "string",
          description: "The issue type name (e.g., 'Task', 'Bug', 'Story')",
        },
        summary: {
          type: "string",
          description: "Brief summary of the issue",
        },
        description: {
          type: "string",
          description: "Detailed description of the issue",
        },
        priority: {
          type: "string",
          description: "Priority name (e.g., 'High', 'Medium', 'Low')",
        },
        labels: {
          type: "array",
          items: { type: "string" },
          description: "Array of labels to add to the issue",
        },
        assignee: {
          type: "string",
          description: "Account ID of the assignee",
        },
      },
      required: ["projectKey", "issueType", "summary"],
    },
  },
  {
    name: "jira_update_issue",
    description:
      "Update an existing Jira issue. Can modify summary, description, status, and other fields.",
    inputSchema: {
      type: "object",
      properties: {
        issueKey: {
          type: "string",
          description: "The issue key (e.g., 'PROJ-123')",
        },
        summary: {
          type: "string",
          description: "New summary for the issue",
        },
        description: {
          type: "string",
          description: "New description for the issue",
        },
        priority: {
          type: "string",
          description: "New priority name",
        },
        labels: {
          type: "array",
          items: { type: "string" },
          description: "New labels (replaces existing)",
        },
        assignee: {
          type: "string",
          description: "Account ID of the new assignee",
        },
      },
      required: ["issueKey"],
    },
  },
  {
    name: "jira_delete_issue",
    description:
      "Delete a Jira issue. This action cannot be undone unless the issue is in the trash.",
    inputSchema: {
      type: "object",
      properties: {
        issueKey: {
          type: "string",
          description: "The issue key to delete (e.g., 'PROJ-123')",
        },
        deleteSubtasks: {
          type: "boolean",
          description: "Whether to delete subtasks if they exist (default: false)",
        },
      },
      required: ["issueKey"],
    },
  },
  {
    name: "jira_get_issue",
    description:
      "Get detailed information about a single Jira issue by its key. Returns all issue fields.",
    inputSchema: {
      type: "object",
      properties: {
        issueKey: {
          type: "string",
          description: "The issue key (e.g., 'PROJ-123')",
        },
        fields: {
          type: "array",
          items: { type: "string" },
          description: "Specific fields to return (default: all fields)",
        },
        expand: {
          type: "array",
          items: { type: "string" },
          description: "Additional properties to expand (e.g., 'changelog', 'renderedFields')",
        },
      },
      required: ["issueKey"],
    },
  },
  {
    name: "jira_get_transitions",
    description:
      "Get available workflow transitions for an issue. Returns transition IDs and names that can be used to change issue status.",
    inputSchema: {
      type: "object",
      properties: {
        issueKey: {
          type: "string",
          description: "The issue key (e.g., 'PROJ-123')",
        },
      },
      required: ["issueKey"],
    },
  },
  {
    name: "jira_transition_issue",
    description:
      "Transition an issue to a new status. Requires a valid transition ID from jira_get_transitions.",
    inputSchema: {
      type: "object",
      properties: {
        issueKey: {
          type: "string",
          description: "The issue key (e.g., 'PROJ-123')",
        },
        transitionId: {
          type: "string",
          description: "The ID of the transition to perform",
        },
        comment: {
          type: "string",
          description: "Optional comment to add when transitioning",
        },
      },
      required: ["issueKey", "transitionId"],
    },
  },
  {
    name: "jira_add_comment",
    description: "Add a comment to a Jira issue. Comments support plain text.",
    inputSchema: {
      type: "object",
      properties: {
        issueKey: {
          type: "string",
          description: "The issue key (e.g., 'PROJ-123')",
        },
        body: {
          type: "string",
          description: "The comment text",
        },
      },
      required: ["issueKey", "body"],
    },
  },
  {
    name: "jira_get_worklog",
    description: "Get all worklog entries for an issue. Returns time spent, author, and dates.",
    inputSchema: {
      type: "object",
      properties: {
        issueKey: {
          type: "string",
          description: "The issue key (e.g., 'PROJ-123')",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of worklogs to return (default: 1000)",
        },
        startAt: {
          type: "number",
          description: "Starting index for pagination (default: 0)",
        },
      },
      required: ["issueKey"],
    },
  },
  {
    name: "jira_add_worklog",
    description: "Add a worklog entry to an issue. Records time spent working on the issue.",
    inputSchema: {
      type: "object",
      properties: {
        issueKey: {
          type: "string",
          description: "The issue key (e.g., 'PROJ-123')",
        },
        timeSpentSeconds: {
          type: "number",
          description: "Time spent in seconds (e.g., 3600 for 1 hour)",
        },
        comment: {
          type: "string",
          description: "Optional description of work done",
        },
        started: {
          type: "string",
          description: "Start time in ISO 8601 format (e.g., '2024-01-15T10:00:00.000+0000')",
        },
      },
      required: ["issueKey", "timeSpentSeconds"],
    },
  },
  {
    name: "jira_get_issue_link_types",
    description:
      "Get all available issue link types. Returns link type names, inward/outward descriptions.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "jira_create_issue_link",
    description:
      "Create a link between two issues. Use jira_get_issue_link_types to see available link types.",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          description: "The link type name (e.g., 'Blocks', 'Relates')",
        },
        inwardIssue: {
          type: "string",
          description: "The inward issue key (e.g., 'PROJ-123')",
        },
        outwardIssue: {
          type: "string",
          description: "The outward issue key (e.g., 'PROJ-456')",
        },
        comment: {
          type: "string",
          description: "Optional comment about the link",
        },
      },
      required: ["type", "inwardIssue", "outwardIssue"],
    },
  },
  {
    name: "jira_get_project_versions",
    description:
      "Get all versions/releases for a project. Returns version names, release dates, and status.",
    inputSchema: {
      type: "object",
      properties: {
        projectKey: {
          type: "string",
          description: "The project key (e.g., 'PROJ')",
        },
      },
      required: ["projectKey"],
    },
  },
  {
    name: "jira_create_version",
    description: "Create a new version/release in a project. Used for release management.",
    inputSchema: {
      type: "object",
      properties: {
        projectKey: {
          type: "string",
          description: "The project key (e.g., 'PROJ')",
        },
        name: {
          type: "string",
          description: "Version name (e.g., 'v1.0.0', 'Release 2024.1')",
        },
        description: {
          type: "string",
          description: "Optional version description",
        },
        releaseDate: {
          type: "string",
          description: "Optional release date in YYYY-MM-DD format",
        },
        released: {
          type: "boolean",
          description: "Whether the version is released (default: false)",
        },
      },
      required: ["projectKey", "name"],
    },
  },
  {
    name: "jira_get_project_issues",
    description: "Get all issues for a specific project. Returns issues ordered by creation date.",
    inputSchema: {
      type: "object",
      properties: {
        projectKey: {
          type: "string",
          description: "The project key (e.g., 'PROJ')",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of issues to return (default: 50)",
        },
        startAt: {
          type: "number",
          description: "Starting index for pagination (default: 0)",
        },
        fields: {
          type: "array",
          items: { type: "string" },
          description: "Specific fields to return",
        },
      },
      required: ["projectKey"],
    },
  },
  {
    name: "jira_search_fields",
    description: "Search for custom fields in Jira. Returns field IDs, names, and schemas.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Query string to search field names",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of fields to return (default: 50)",
        },
        startAt: {
          type: "number",
          description: "Starting index for pagination (default: 0)",
        },
      },
    },
  },
  {
    name: "jira_get_agile_boards",
    description: "Get all agile boards. Can filter by project. Returns board names and types.",
    inputSchema: {
      type: "object",
      properties: {
        projectKeyOrId: {
          type: "string",
          description: "Filter by project key or ID",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of boards to return (default: 50)",
        },
        startAt: {
          type: "number",
          description: "Starting index for pagination (default: 0)",
        },
      },
    },
  },
  {
    name: "jira_create_board",
    description:
      "Create a new agile board (Scrum or Kanban). The board can be created for a specific project or based on a filter.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Board name",
        },
        type: {
          type: "string",
          description: "Board type: 'scrum' or 'kanban'",
        },
        projectKeyOrId: {
          type: "string",
          description: "Project key or ID to associate with the board",
        },
        filterId: {
          type: "number",
          description: "Optional: Filter ID to base the board on (instead of project)",
        },
      },
      required: ["name", "type", "projectKeyOrId"],
    },
  },
  {
    name: "jira_update_board",
    description:
      "Update an existing board. Can modify board name or filter. Note: Cannot change board type.",
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "number",
          description: "The board ID to update",
        },
        name: {
          type: "string",
          description: "New board name",
        },
        filterId: {
          type: "number",
          description: "New filter ID",
        },
      },
      required: ["boardId"],
    },
  },
  {
    name: "jira_delete_board",
    description:
      "Delete a board. Warning: This is permanent and cannot be undone. All board configuration will be lost.",
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "number",
          description: "The board ID to delete",
        },
      },
      required: ["boardId"],
    },
  },
  {
    name: "jira_get_board_issues",
    description:
      "Get all issues on a specific board. Can filter with JQL. Returns issue keys and summaries.",
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "number",
          description: "The board ID",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of issues to return (default: 50)",
        },
        startAt: {
          type: "number",
          description: "Starting index for pagination (default: 0)",
        },
        jql: {
          type: "string",
          description: "Optional JQL filter for issues",
        },
      },
      required: ["boardId"],
    },
  },
  {
    name: "jira_get_sprints_from_board",
    description:
      "Get all sprints from a board. Can filter by state (active, future, closed). Returns sprint names and dates.",
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "number",
          description: "The board ID",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of sprints to return (default: 50)",
        },
        startAt: {
          type: "number",
          description: "Starting index for pagination (default: 0)",
        },
        state: {
          type: "string",
          description: "Filter by sprint state: active, future, closed",
        },
      },
      required: ["boardId"],
    },
  },
  {
    name: "jira_get_sprint_issues",
    description: "Get all issues in a specific sprint. Returns issue details and status.",
    inputSchema: {
      type: "object",
      properties: {
        sprintId: {
          type: "number",
          description: "The sprint ID",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of issues to return (default: 50)",
        },
        startAt: {
          type: "number",
          description: "Starting index for pagination (default: 0)",
        },
        fields: {
          type: "array",
          items: { type: "string" },
          description: "Specific fields to return",
        },
      },
      required: ["sprintId"],
    },
  },
  {
    name: "jira_batch_get_changelogs",
    description:
      "Batch get changelogs for multiple issues. Returns complete change history for each issue.",
    inputSchema: {
      type: "object",
      properties: {
        issueKeys: {
          type: "array",
          items: { type: "string" },
          description: "Array of issue keys (e.g., ['PROJ-1', 'PROJ-2'])",
        },
      },
      required: ["issueKeys"],
    },
  },
  {
    name: "jira_get_user_profile",
    description:
      "Get user profile information by account ID. Returns display name, email, and avatar.",
    inputSchema: {
      type: "object",
      properties: {
        accountId: {
          type: "string",
          description: "The user's account ID",
        },
      },
      required: ["accountId"],
    },
  },
  {
    name: "jira_download_attachments",
    description:
      "Get attachment information including download URL. Returns attachment metadata and content URL.",
    inputSchema: {
      type: "object",
      properties: {
        attachmentId: {
          type: "string",
          description: "The attachment ID",
        },
      },
      required: ["attachmentId"],
    },
  },
  {
    name: "jira_batch_create_issues",
    description:
      "Create multiple issues in a single request. More efficient than creating one at a time.",
    inputSchema: {
      type: "object",
      properties: {
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              projectKey: { type: "string" },
              issueType: { type: "string" },
              summary: { type: "string" },
              description: { type: "string" },
              priority: { type: "string" },
              labels: { type: "array", items: { type: "string" } },
              assignee: { type: "string" },
            },
            required: ["projectKey", "issueType", "summary"],
          },
          description: "Array of issues to create",
        },
      },
      required: ["issues"],
    },
  },
  {
    name: "jira_link_to_epic",
    description:
      "Link multiple issues to an epic. Creates Epic-Story links between issues and epic.",
    inputSchema: {
      type: "object",
      properties: {
        epicKey: {
          type: "string",
          description: "The epic issue key (e.g., 'PROJ-123')",
        },
        issueKeys: {
          type: "array",
          items: { type: "string" },
          description: "Array of issue keys to link to the epic",
        },
      },
      required: ["epicKey", "issueKeys"],
    },
  },
  {
    name: "jira_create_sprint",
    description:
      "Create a new sprint on a board. Requires board ID, sprint name, and optional dates.",
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "number",
          description: "The board ID where sprint will be created",
        },
        name: {
          type: "string",
          description: "Sprint name (e.g., 'Sprint 1', 'Q1 Sprint')",
        },
        startDate: {
          type: "string",
          description: "Start date in ISO 8601 format (e.g., '2024-01-15T10:00:00.000Z')",
        },
        endDate: {
          type: "string",
          description: "End date in ISO 8601 format",
        },
        goal: {
          type: "string",
          description: "Sprint goal description",
        },
      },
      required: ["boardId", "name"],
    },
  },
  {
    name: "jira_update_sprint",
    description:
      "Update an existing sprint. Can modify name, dates, goal, or state (start/close sprint).",
    inputSchema: {
      type: "object",
      properties: {
        sprintId: {
          type: "number",
          description: "The sprint ID to update",
        },
        name: {
          type: "string",
          description: "New sprint name",
        },
        startDate: {
          type: "string",
          description: "New start date in ISO 8601 format",
        },
        endDate: {
          type: "string",
          description: "New end date in ISO 8601 format",
        },
        goal: {
          type: "string",
          description: "New sprint goal",
        },
        state: {
          type: "string",
          description: "Sprint state: active, future, closed",
        },
      },
      required: ["sprintId"],
    },
  },
  {
    name: "jira_delete_sprint",
    description:
      "Delete a sprint. Note: Can only delete sprints that have not been started (future state). Cannot delete active or closed sprints.",
    inputSchema: {
      type: "object",
      properties: {
        sprintId: {
          type: "number",
          description: "The sprint ID to delete",
        },
      },
      required: ["sprintId"],
    },
  },
  {
    name: "jira_remove_issue_link",
    description: "Remove/delete a link between two issues. Requires the link ID.",
    inputSchema: {
      type: "object",
      properties: {
        linkId: {
          type: "string",
          description: "The issue link ID to remove",
        },
      },
      required: ["linkId"],
    },
  },
  {
    name: "jira_move_issues_to_sprint",
    description:
      "Move issues to a sprint. This is essential for sprint planning - add issues from backlog to sprint.",
    inputSchema: {
      type: "object",
      properties: {
        sprintId: {
          type: "number",
          description: "The sprint ID to move issues to",
        },
        issues: {
          type: "array",
          items: { type: "string" },
          description: "Array of issue keys to move (e.g., ['PROJ-1', 'PROJ-2'])",
        },
      },
      required: ["sprintId", "issues"],
    },
  },
  {
    name: "jira_get_backlog_issues",
    description:
      "Get all issues in the backlog for a board. Returns issues that are not assigned to any sprint.",
    inputSchema: {
      type: "object",
      properties: {
        boardId: {
          type: "number",
          description: "The board ID",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of issues to return (default: 50)",
        },
        startAt: {
          type: "number",
          description: "Starting index for pagination (default: 0)",
        },
        jql: {
          type: "string",
          description: "Additional JQL filter",
        },
        fields: {
          type: "array",
          items: { type: "string" },
          description: "Specific fields to return",
        },
      },
      required: ["boardId"],
    },
  },
  {
    name: "jira_rank_backlog_issues",
    description:
      "Rank/reorder issues in the backlog. Used to adjust issue priority order before sprint planning. Specify either rankBeforeIssue or rankAfterIssue to position the issues.",
    inputSchema: {
      type: "object",
      properties: {
        issueKeys: {
          type: "array",
          items: { type: "string" },
          description: "Array of issue keys to rank (e.g., ['PROJ-1', 'PROJ-2'])",
        },
        rankBeforeIssue: {
          type: "string",
          description: "Rank the issues before this issue key (e.g., 'PROJ-10')",
        },
        rankAfterIssue: {
          type: "string",
          description: "Rank the issues after this issue key (e.g., 'PROJ-5')",
        },
      },
      required: ["issueKeys"],
    },
  },
  {
    name: "jira_get_epic_issues",
    description:
      "Get all issues (stories, tasks, bugs) that belong to an epic. Returns child issues of the epic.",
    inputSchema: {
      type: "object",
      properties: {
        epicIdOrKey: {
          type: "string",
          description: "The epic ID or key (e.g., 'PROJ-123')",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of issues to return (default: 50)",
        },
        startAt: {
          type: "number",
          description: "Starting index for pagination (default: 0)",
        },
        fields: {
          type: "array",
          items: { type: "string" },
          description: "Specific fields to return",
        },
      },
      required: ["epicIdOrKey"],
    },
  },
  {
    name: "jira_batch_create_versions",
    description:
      "Create multiple versions/releases in a project. More efficient than creating one at a time.",
    inputSchema: {
      type: "object",
      properties: {
        projectKey: {
          type: "string",
          description: "The project key",
        },
        versions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              releaseDate: { type: "string" },
              released: { type: "boolean" },
            },
            required: ["name"],
          },
          description: "Array of versions to create",
        },
      },
      required: ["projectKey", "versions"],
    },
  },
];

/**
 * Handle Jira tool calls
 */
export async function handleJiraTool(
  toolName: string,
  args: Record<string, unknown>,
  api: JiraAPI
): Promise<{ content: Array<{ type: string; text: string }>; isError?: boolean }> {
  try {
    let result: string;

    switch (toolName) {
      case "jira_list_projects": {
        const data = await api.listProjects({
          maxResults: args.maxResults as number | undefined,
          startAt: args.startAt as number | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_search_issues": {
        const data = await api.searchIssues({
          jql: args.jql as string,
          maxResults: args.maxResults as number | undefined,
          nextPageToken: args.nextPageToken as string | undefined,
          fields: args.fields as string[] | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_create_issue": {
        const data = await api.createIssue({
          projectKey: args.projectKey as string,
          issueType: args.issueType as string,
          summary: args.summary as string,
          description: args.description as string | undefined,
          priority: args.priority as string | undefined,
          labels: args.labels as string[] | undefined,
          assignee: args.assignee as string | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_update_issue": {
        await api.updateIssue({
          issueKey: args.issueKey as string,
          summary: args.summary as string | undefined,
          description: args.description as string | undefined,
          priority: args.priority as string | undefined,
          labels: args.labels as string[] | undefined,
          assignee: args.assignee as string | undefined,
        });
        result = `Issue ${args.issueKey} updated successfully`;
        break;
      }

      case "jira_delete_issue": {
        await api.deleteIssue({
          issueKey: args.issueKey as string,
          deleteSubtasks: args.deleteSubtasks as boolean | undefined,
        });
        result = `Issue ${args.issueKey} deleted successfully`;
        break;
      }

      case "jira_get_issue": {
        const data = await api.getIssue({
          issueKey: args.issueKey as string,
          fields: args.fields as string[] | undefined,
          expand: args.expand as string[] | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_get_transitions": {
        const data = await api.getTransitions({
          issueKey: args.issueKey as string,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_transition_issue": {
        await api.transitionIssue({
          issueKey: args.issueKey as string,
          transitionId: args.transitionId as string,
          comment: args.comment as string | undefined,
        });
        result = `Issue ${args.issueKey} transitioned successfully`;
        break;
      }

      case "jira_add_comment": {
        const data = await api.addComment({
          issueKey: args.issueKey as string,
          body: args.body as string,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_get_worklog": {
        const data = await api.getWorklog({
          issueKey: args.issueKey as string,
          maxResults: args.maxResults as number | undefined,
          startAt: args.startAt as number | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_add_worklog": {
        const data = await api.addWorklog({
          issueKey: args.issueKey as string,
          timeSpentSeconds: args.timeSpentSeconds as number,
          comment: args.comment as string | undefined,
          started: args.started as string | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_get_issue_link_types": {
        const data = await api.getIssueLinkTypes({});
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_create_issue_link": {
        await api.createIssueLink({
          type: args.type as string,
          inwardIssue: args.inwardIssue as string,
          outwardIssue: args.outwardIssue as string,
          comment: args.comment as string | undefined,
        });
        result = `Issue link created successfully between ${args.inwardIssue} and ${args.outwardIssue}`;
        break;
      }

      case "jira_get_project_versions": {
        const data = await api.getProjectVersions({
          projectKey: args.projectKey as string,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_create_version": {
        const data = await api.createVersion({
          projectKey: args.projectKey as string,
          name: args.name as string,
          description: args.description as string | undefined,
          releaseDate: args.releaseDate as string | undefined,
          released: args.released as boolean | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_get_project_issues": {
        const data = await api.getProjectIssues({
          projectKey: args.projectKey as string,
          maxResults: args.maxResults as number | undefined,
          startAt: args.startAt as number | undefined,
          fields: args.fields as string[] | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_search_fields": {
        const data = await api.searchFields({
          query: args.query as string | undefined,
          maxResults: args.maxResults as number | undefined,
          startAt: args.startAt as number | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_get_agile_boards": {
        const data = await api.getAgileBoards({
          projectKeyOrId: args.projectKeyOrId as string | undefined,
          maxResults: args.maxResults as number | undefined,
          startAt: args.startAt as number | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_create_board": {
        const data = await api.createBoard({
          name: args.name as string,
          type: args.type as "scrum" | "kanban",
          projectKeyOrId: args.projectKeyOrId as string,
          filterId: args.filterId as number | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_update_board": {
        const data = await api.updateBoard({
          boardId: args.boardId as number,
          name: args.name as string | undefined,
          filterId: args.filterId as number | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_delete_board": {
        await api.deleteBoard({
          boardId: args.boardId as number,
        });
        result = `Board ${args.boardId} deleted successfully`;
        break;
      }

      case "jira_get_board_issues": {
        const data = await api.getBoardIssues({
          boardId: args.boardId as number,
          maxResults: args.maxResults as number | undefined,
          startAt: args.startAt as number | undefined,
          jql: args.jql as string | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_get_sprints_from_board": {
        const data = await api.getSprintsFromBoard({
          boardId: args.boardId as number,
          maxResults: args.maxResults as number | undefined,
          startAt: args.startAt as number | undefined,
          state: args.state as string | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_get_sprint_issues": {
        const data = await api.getSprintIssues({
          sprintId: args.sprintId as number,
          maxResults: args.maxResults as number | undefined,
          startAt: args.startAt as number | undefined,
          fields: args.fields as string[] | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_batch_get_changelogs": {
        const data = await api.batchGetChangelogs({
          issueKeys: args.issueKeys as string[],
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_get_user_profile": {
        const data = await api.getUserProfile({
          accountId: args.accountId as string,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_download_attachments": {
        const data = await api.downloadAttachments({
          attachmentId: args.attachmentId as string,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_batch_create_issues": {
        const data = await api.batchCreateIssues({
          issues: args.issues as Array<{
            projectKey: string;
            issueType: string;
            summary: string;
            description?: string;
            priority?: string;
            labels?: string[];
            assignee?: string;
          }>,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_link_to_epic": {
        await api.linkToEpic({
          epicKey: args.epicKey as string,
          issueKeys: args.issueKeys as string[],
        });
        result = `Successfully linked ${(args.issueKeys as string[]).length} issues to epic ${args.epicKey}`;
        break;
      }

      case "jira_create_sprint": {
        const data = await api.createSprint({
          boardId: args.boardId as number,
          name: args.name as string,
          startDate: args.startDate as string | undefined,
          endDate: args.endDate as string | undefined,
          goal: args.goal as string | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_update_sprint": {
        const data = await api.updateSprint({
          sprintId: args.sprintId as number,
          name: args.name as string | undefined,
          startDate: args.startDate as string | undefined,
          endDate: args.endDate as string | undefined,
          goal: args.goal as string | undefined,
          state: args.state as string | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_delete_sprint": {
        await api.deleteSprint({
          sprintId: args.sprintId as number,
        });
        result = `Sprint ${args.sprintId} deleted successfully`;
        break;
      }

      case "jira_remove_issue_link": {
        await api.removeIssueLink({
          linkId: args.linkId as string,
        });
        result = `Issue link ${args.linkId} removed successfully`;
        break;
      }

      case "jira_move_issues_to_sprint": {
        await api.moveIssuesToSprint({
          sprintId: args.sprintId as number,
          issues: args.issues as string[],
        });
        result = `Successfully moved ${(args.issues as string[]).length} issues to sprint ${args.sprintId}`;
        break;
      }

      case "jira_get_backlog_issues": {
        const data = await api.getBacklogIssues({
          boardId: args.boardId as number,
          maxResults: args.maxResults as number | undefined,
          startAt: args.startAt as number | undefined,
          jql: args.jql as string | undefined,
          fields: args.fields as string[] | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_rank_backlog_issues": {
        await api.rankBacklogIssues({
          issueKeys: args.issueKeys as string[],
          rankBeforeIssue: args.rankBeforeIssue as string | undefined,
          rankAfterIssue: args.rankAfterIssue as string | undefined,
        });
        result = `Successfully ranked ${(args.issueKeys as string[]).length} issues in backlog`;
        break;
      }

      case "jira_get_epic_issues": {
        const data = await api.getEpicIssues({
          epicIdOrKey: args.epicIdOrKey as string,
          maxResults: args.maxResults as number | undefined,
          startAt: args.startAt as number | undefined,
          fields: args.fields as string[] | undefined,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      case "jira_batch_create_versions": {
        const data = await api.batchCreateVersions({
          projectKey: args.projectKey as string,
          versions: args.versions as Array<{
            name: string;
            description?: string;
            releaseDate?: string;
            released?: boolean;
          }>,
        });
        result = JSON.stringify(data, null, 2);
        break;
      }

      default:
        throw new Error(`Unknown Jira tool: ${toolName}`);
    }

    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}
