/**
 * Confluence MCP tools definitions
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import type { ConfluenceAPI } from "./api.js";

export const confluenceTools: Tool[] = [
  {
    name: "confluence_list_spaces",
    description: "List all Confluence spaces. Returns space keys, names, and types.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of spaces to return (default: 25)",
        },
        start: {
          type: "number",
          description: "Starting index for pagination (default: 0)",
        },
      },
    },
  },
  {
    name: "confluence_list_pages",
    description: "List pages in a Confluence space. Returns page titles, IDs, and metadata.",
    inputSchema: {
      type: "object",
      properties: {
        spaceId: {
          type: "string",
          description: "The ID of the space to list pages from",
        },
        limit: {
          type: "number",
          description: "Maximum number of pages to return (default: 50, max: 250)",
        },
        cursor: {
          type: "string",
          description: "Cursor for pagination",
        },
        status: {
          type: "string",
          description: "Filter by status: current, archived, or trashed",
          enum: ["current", "archived", "trashed"],
        },
      },
    },
  },
  {
    name: "confluence_create_page",
    description:
      "Create a new page in Confluence. Requires space ID, title, and content in storage format.",
    inputSchema: {
      type: "object",
      properties: {
        spaceId: {
          type: "string",
          description: "The ID of the space where the page will be created",
        },
        title: {
          type: "string",
          description: "The title of the new page",
        },
        body: {
          type: "string",
          description: "The content of the page in Confluence storage format (HTML-like format)",
        },
        parentId: {
          type: "string",
          description: "Optional parent page ID to create as a child page",
        },
      },
      required: ["spaceId", "title", "body"],
    },
  },
  {
    name: "confluence_update_page",
    description: "Update an existing Confluence page. Requires page ID, new title, and content.",
    inputSchema: {
      type: "object",
      properties: {
        pageId: {
          type: "string",
          description: "The ID of the page to update",
        },
        title: {
          type: "string",
          description: "The new title for the page",
        },
        body: {
          type: "string",
          description: "The new content in Confluence storage format (HTML-like format)",
        },
        version: {
          type: "number",
          description: "The current version number of the page (incremented automatically)",
        },
      },
      required: ["pageId", "title", "body", "version"],
    },
  },
  {
    name: "confluence_search",
    description:
      "Search Confluence content using CQL (Confluence Query Language). Returns matching pages, blog posts, and other content.",
    inputSchema: {
      type: "object",
      properties: {
        cql: {
          type: "string",
          description:
            "CQL query string (e.g., 'type=page AND space=DEV', 'title~\"documentation\"')",
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return (default: 25)",
        },
        start: {
          type: "number",
          description: "Starting index for pagination (default: 0)",
        },
        expand: {
          type: "string",
          description:
            "Comma-separated list of properties to expand (e.g., 'body.storage,metadata.labels')",
        },
      },
      required: ["cql"],
    },
  },
  {
    name: "confluence_get_page",
    description: "Get a single page by ID with detailed information. Supports single body format.",
    inputSchema: {
      type: "object",
      properties: {
        pageId: {
          type: "string",
          description: "The ID of the page to retrieve",
        },
        bodyFormat: {
          type: "string",
          description:
            "Body format to retrieve: storage, view, atlas_doc_format, export_view, anonymous_export_view, styled_view, editor (default: 'storage')",
        },
      },
      required: ["pageId"],
    },
  },
  {
    name: "confluence_get_page_children",
    description: "Get child pages of a specific page. Returns a list of direct children.",
    inputSchema: {
      type: "object",
      properties: {
        pageId: {
          type: "string",
          description: "The ID of the parent page",
        },
        limit: {
          type: "number",
          description: "Maximum number of children to return (default: 25, max: 250)",
        },
        cursor: {
          type: "string",
          description: "Cursor for pagination",
        },
        sort: {
          type: "string",
          description: "Sort field (e.g., 'title', 'created-date')",
        },
      },
      required: ["pageId"],
    },
  },
  {
    name: "confluence_get_comments",
    description: "Get footer comments on a page. Returns comments with their content and metadata.",
    inputSchema: {
      type: "object",
      properties: {
        pageId: {
          type: "string",
          description: "The ID of the page",
        },
        bodyFormat: {
          type: "string",
          description: "Body format for comment content: storage, view (default: storage)",
        },
        limit: {
          type: "number",
          description: "Maximum number of comments to return (default: 25)",
        },
        cursor: {
          type: "string",
          description: "Cursor for pagination",
        },
      },
      required: ["pageId"],
    },
  },
  {
    name: "confluence_get_labels",
    description: "Get labels attached to a page. Returns label names and prefixes.",
    inputSchema: {
      type: "object",
      properties: {
        pageId: {
          type: "string",
          description: "The ID of the page",
        },
        prefix: {
          type: "string",
          description: "Filter by label prefix: my, team, global, system (default: returns all)",
        },
        limit: {
          type: "number",
          description: "Maximum number of labels to return (default: 25, max: 250)",
        },
        cursor: {
          type: "string",
          description: "Cursor for pagination",
        },
        sort: {
          type: "string",
          description: "Sort field",
        },
      },
      required: ["pageId"],
    },
  },
  {
    name: "confluence_search_user",
    description:
      "Search for users using CQL. Returns user information including account ID, display name, and email.",
    inputSchema: {
      type: "object",
      properties: {
        cql: {
          type: "string",
          description:
            "CQL query for user search (e.g., 'user.fullname~\"John\"', 'user.accountid=\"123\"')",
        },
        limit: {
          type: "number",
          description: "Maximum number of users to return (default: 25)",
        },
        start: {
          type: "number",
          description: "Starting index for pagination (default: 0)",
        },
      },
      required: ["cql"],
    },
  },
  {
    name: "confluence_delete_page",
    description:
      "Delete a page. By default, moves to trash. Use purge option for permanent deletion.",
    inputSchema: {
      type: "object",
      properties: {
        pageId: {
          type: "string",
          description: "The ID of the page to delete",
        },
        purge: {
          type: "boolean",
          description:
            "If true, permanently delete the page. If false, move to trash (default: false)",
        },
      },
      required: ["pageId"],
    },
  },
  {
    name: "confluence_add_label",
    description: "Add one or more labels to a page. Labels help organize and categorize content.",
    inputSchema: {
      type: "object",
      properties: {
        pageId: {
          type: "string",
          description: "The ID of the page",
        },
        labels: {
          type: "array",
          items: {
            type: "object",
            properties: {
              prefix: {
                type: "string",
                description: "Label prefix (usually 'global')",
              },
              name: {
                type: "string",
                description: "Label name",
              },
            },
            required: ["prefix", "name"],
          },
          description: "Array of labels to add (e.g., [{'prefix': 'global', 'name': 'important'}])",
        },
      },
      required: ["pageId", "labels"],
    },
  },
  {
    name: "confluence_add_comment",
    description:
      "Add a footer comment to a page. Can be a top-level comment or a reply to another comment.",
    inputSchema: {
      type: "object",
      properties: {
        pageId: {
          type: "string",
          description: "The ID of the page to comment on",
        },
        body: {
          type: "string",
          description: "Comment content in storage format (HTML-like format)",
        },
        parentCommentId: {
          type: "string",
          description: "Optional: ID of parent comment to create a reply",
        },
      },
      required: ["pageId", "body"],
    },
  },
];

/**
 * Handle Confluence tool calls
 */
export async function handleConfluenceTool(
  toolName: string,
  args: Record<string, unknown>,
  api: ConfluenceAPI
): Promise<{ content: Array<{ type: string; text: string }>; isError?: boolean }> {
  try {
    let data: unknown;

    switch (toolName) {
      case "confluence_list_spaces": {
        data = await api.listSpaces({
          limit: args.limit as number | undefined,
          start: args.start as number | undefined,
        });
        break;
      }

      case "confluence_list_pages": {
        data = await api.listPages({
          spaceId: args.spaceId as string,
          limit: args.limit as number | undefined,
          cursor: args.cursor as string | undefined,
          status: args.status as "current" | "archived" | "trashed" | undefined,
        });
        break;
      }

      case "confluence_create_page": {
        data = await api.createPage({
          spaceId: args.spaceId as string,
          title: args.title as string,
          body: args.body as string,
          parentId: args.parentId as string | undefined,
        });
        break;
      }

      case "confluence_update_page": {
        data = await api.updatePage({
          pageId: args.pageId as string,
          title: args.title as string,
          body: args.body as string,
          version: args.version as number,
        });
        break;
      }

      case "confluence_search": {
        data = await api.search({
          cql: args.cql as string,
          limit: args.limit as number | undefined,
          start: args.start as number | undefined,
          expand: args.expand as string | undefined,
        });
        break;
      }

      case "confluence_get_page": {
        data = await api.getPage({
          pageId: args.pageId as string,
          bodyFormat: args.bodyFormat as string | undefined,
        });
        break;
      }

      case "confluence_get_page_children": {
        data = await api.getPageChildren({
          pageId: args.pageId as string,
          limit: args.limit as number | undefined,
          cursor: args.cursor as string | undefined,
          sort: args.sort as string | undefined,
        });
        break;
      }

      case "confluence_get_comments": {
        data = await api.getComments({
          pageId: args.pageId as string,
          bodyFormat: args.bodyFormat as string | undefined,
          limit: args.limit as number | undefined,
          cursor: args.cursor as string | undefined,
        });
        break;
      }

      case "confluence_get_labels": {
        data = await api.getLabels({
          pageId: args.pageId as string,
          prefix: args.prefix as string | undefined,
          limit: args.limit as number | undefined,
          cursor: args.cursor as string | undefined,
          sort: args.sort as string | undefined,
        });
        break;
      }

      case "confluence_search_user": {
        data = await api.searchUser({
          cql: args.cql as string,
          limit: args.limit as number | undefined,
          start: args.start as number | undefined,
        });
        break;
      }

      case "confluence_delete_page": {
        await api.deletePage({
          pageId: args.pageId as string,
          purge: args.purge as boolean | undefined,
        });
        // DELETE returns void, so return a success message
        return {
          content: [
            {
              type: "text",
              text: `Page ${args.pageId} deleted successfully${
                args.purge ? " (permanently)" : " (moved to trash)"
              }`,
            },
          ],
        };
      }

      case "confluence_add_label": {
        data = await api.addLabel({
          pageId: args.pageId as string,
          labels: args.labels as Array<{ prefix: string; name: string }>,
        });
        break;
      }

      case "confluence_add_comment": {
        data = await api.addComment({
          pageId: args.pageId as string,
          body: args.body as string,
          parentCommentId: args.parentCommentId as string | undefined,
        });
        break;
      }

      default:
        throw new Error(`Unknown Confluence tool: ${toolName}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
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
