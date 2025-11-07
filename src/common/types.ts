/**
 * Common type definitions for the Atlassian MCP server
 */

export interface AtlassianConfig {
  domain: string;
  email: string;
  apiToken: string;
}

export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}
