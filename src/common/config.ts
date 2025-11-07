/**
 * Configuration loading utilities
 * Supports multiple configuration sources with priority:
 * 1. Command-line arguments (highest priority)
 * 2. Environment variables
 * 3. Config file
 */

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { resolve } from "node:path";
import type { AtlassianConfig } from "./types.js";

export interface ConfigFileFormat {
  domain: string;
  email: string;
  apiToken: string;
}

/**
 * Load configuration from a JSON file
 */
export function loadConfigFile(configPath: string): ConfigFileFormat | null {
  try {
    // Expand ~ to home directory
    const expandedPath = configPath.startsWith("~")
      ? resolve(homedir(), configPath.slice(2))
      : resolve(configPath);

    if (!existsSync(expandedPath)) {
      return null;
    }

    const content = readFileSync(expandedPath, "utf-8");
    const config = JSON.parse(content) as ConfigFileFormat;

    // Validate required fields
    if (!config.domain || !config.email || !config.apiToken) {
      throw new Error("Config file missing required fields: domain, email, apiToken");
    }

    return config;
  } catch (error) {
    throw new Error(
      `Failed to load config file: ${error instanceof Error ? error.message : error}`
    );
  }
}

/**
 * Load configuration from multiple sources with priority
 */
export function loadConfig(options: {
  configPath?: string;
  domain?: string;
  email?: string;
  apiToken?: string;
}): AtlassianConfig {
  let config: Partial<AtlassianConfig> = {};

  // 1. Try config file if provided
  if (options.configPath) {
    const fileConfig = loadConfigFile(options.configPath);
    if (fileConfig) {
      config = {
        domain: fileConfig.domain,
        email: fileConfig.email,
        apiToken: fileConfig.apiToken,
      };
    }
  }

  // 2. Try default config file locations
  if (!options.configPath) {
    const defaultPaths = [
      "~/.atlassian-mcp.json",
      "~/.config/atlassian-mcp/config.json",
      ".atlassian-mcp.json",
    ];

    for (const path of defaultPaths) {
      const fileConfig = loadConfigFile(path);
      if (fileConfig) {
        config = {
          domain: fileConfig.domain,
          email: fileConfig.email,
          apiToken: fileConfig.apiToken,
        };
        break;
      }
    }
  }

  // 3. Override with environment variables
  if (process.env.ATLASSIAN_DOMAIN) {
    config.domain = process.env.ATLASSIAN_DOMAIN;
  }
  if (process.env.ATLASSIAN_EMAIL) {
    config.email = process.env.ATLASSIAN_EMAIL;
  }
  if (process.env.ATLASSIAN_API_TOKEN) {
    config.apiToken = process.env.ATLASSIAN_API_TOKEN;
  }

  // 4. Override with command-line arguments (highest priority)
  if (options.domain) {
    config.domain = options.domain;
  }
  if (options.email) {
    config.email = options.email;
  }
  if (options.apiToken) {
    config.apiToken = options.apiToken;
  }

  // Validate final configuration
  if (!config.domain || !config.email || !config.apiToken) {
    const missing: string[] = [];
    if (!config.domain) missing.push("domain");
    if (!config.email) missing.push("email");
    if (!config.apiToken) missing.push("apiToken");

    throw new Error(
      `Missing required configuration: ${missing.join(", ")}\n\n` +
        "Configuration can be provided via:\n" +
        "  1. Command-line arguments: --domain, --email, --token\n" +
        "  2. Environment variables: ATLASSIAN_DOMAIN, ATLASSIAN_EMAIL, ATLASSIAN_API_TOKEN\n" +
        "  3. Config file: ~/.atlassian-mcp.json or --config <path>\n"
    );
  }

  return config as AtlassianConfig;
}
