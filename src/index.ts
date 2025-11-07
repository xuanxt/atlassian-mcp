#!/usr/bin/env node
/**
 * Atlassian MCP Server - Main Entry Point
 *
 * A Model Context Protocol server for Atlassian Confluence and Jira Cloud APIs
 *
 * Can be run with Node.js (using tsx) or Bun directly
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { Command } from "commander";

import { AtlassianAuth } from "./common/auth.js";
import { loadConfig } from "./common/config.js";
import { ConfluenceAPI } from "./confluence/api.js";
import { confluenceTools, handleConfluenceTool } from "./confluence/tools.js";
import { JiraAPI } from "./jira/api.js";
import { handleJiraTool, jiraTools } from "./jira/tools.js";

// Parse command-line arguments
const program = new Command();

program
  .name("atlassian-mcp")
  .description("MCP server for Atlassian Confluence and Jira Cloud APIs")
  .version("1.0.0")
  .option("-c, --config <path>", "Path to config file (JSON)")
  .option("-d, --domain <domain>", "Atlassian domain (e.g., your-domain.atlassian.net)")
  .option("-e, --email <email>", "Atlassian account email")
  .option("-t, --token <token>", "Atlassian API token")
  .parse(process.argv);

const options = program.opts();

// Load configuration from multiple sources
// Priority: CLI args > env vars > config file
const config = loadConfig({
  configPath: options.config,
  domain: options.domain,
  email: options.email,
  apiToken: options.token,
});

// Initialize authentication and API clients
const auth = new AtlassianAuth(config);
const confluenceAPI = new ConfluenceAPI(auth);
const jiraAPI = new JiraAPI(auth);

// Combine all tools
const allTools = [...confluenceTools, ...jiraTools];

// Create MCP server
const server = new Server(
  {
    name: "atlassian-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: allTools };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // Route to appropriate handler based on tool name prefix
  if (name.startsWith("confluence_")) {
    return handleConfluenceTool(name, args || {}, confluenceAPI);
  }

  if (name.startsWith("jira_")) {
    return handleJiraTool(name, args || {}, jiraAPI);
  }

  // Unknown tool
  return {
    content: [
      {
        type: "text",
        text: `Error: Unknown tool: ${name}`,
      },
    ],
    isError: true,
  };
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Atlassian MCP server running on stdio");
}

main();
