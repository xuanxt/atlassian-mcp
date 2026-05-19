/**
 * Authentication utilities for Atlassian APIs
 */

import type { AtlassianConfig, RequestOptions } from "./types.js";

export class AtlassianAuth {
  private readonly config: AtlassianConfig;
  private readonly baseUrl: string;
  private readonly gatewayCloudId: string | null;

  constructor(config: AtlassianConfig) {
    this.config = config;
    // Support both full URLs (https://domain.com) and plain domains (domain.com)
    this.baseUrl = config.domain.startsWith("http") ? config.domain : `https://${config.domain}`;

    // Check if using API gateway with cloudId (e.g., api.atlassian.com/ex/jira/xxx-xxx)
    const gatewayMatch = this.baseUrl.match(/api\.atlassian\.com\/ex\/(?:jira|confluence)\/([a-f0-9-]+)/i);
    this.gatewayCloudId = gatewayMatch ? gatewayMatch[1] : null;
  }

  /**
   * Get the appropriate base URL for a given API path.
   * When using the API gateway, automatically routes to the correct service
   * (Jira vs Confluence) based on the path prefix.
   */
  private getBaseUrlForPath(path: string): string {
    if (!this.gatewayCloudId) {
      return this.baseUrl;
    }
    // Confluence paths start with /wiki/ or equal /wiki, everything else is Jira
    const isConfluence = path.startsWith("/wiki/") || path === "/wiki";
    const service = isConfluence ? "confluence" : "jira";
    return `https://api.atlassian.com/ex/${service}/${this.gatewayCloudId}`;
  }

  /**
   * Make an authenticated request to the Atlassian API
   */
  async request(path: string, options: RequestOptions = {}): Promise<unknown> {
    const auth = btoa(`${this.config.email}:${this.config.apiToken}`);
    const url = `${this.getBaseUrlForPath(path)}${path}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Atlassian API error (${response.status}): ${error}`);
    }

    // Handle 204 No Content responses (e.g., from PUT/DELETE operations)
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return null;
    }

    return response.json();
  }

  /**
   * Get the base URL for API requests
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}
