/**
 * Authentication utilities for Atlassian APIs
 */

import type { AtlassianConfig, RequestOptions } from "./types.js";

export class AtlassianAuth {
  private readonly config: AtlassianConfig;
  private readonly baseUrl: string;

  constructor(config: AtlassianConfig) {
    this.config = config;
    // Support both full URLs (https://domain.com) and plain domains (domain.com)
    this.baseUrl = config.domain.startsWith("http") ? config.domain : `https://${config.domain}`;
  }

  /**
   * Make an authenticated request to the Atlassian API
   */
  async request(path: string, options: RequestOptions = {}): Promise<unknown> {
    const auth = btoa(`${this.config.email}:${this.config.apiToken}`);
    const url = `${this.baseUrl}${path}`;

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
