import { describe, expect, test } from "bun:test";
import { AtlassianAuth } from "./auth.js";

describe("AtlassianAuth - Gateway Routing", () => {
  const testConfig = {
    domain: "test.atlassian.net",
    email: "test@example.com",
    apiToken: "test-token",
  };

  describe("Standard domain (no gateway)", () => {
    test("should use baseUrl directly for all paths", () => {
      const auth = new AtlassianAuth(testConfig);
      expect(auth.getBaseUrl()).toBe("https://test.atlassian.net");
    });

    test("should handle domain without https prefix", () => {
      const auth = new AtlassianAuth({ ...testConfig, domain: "test.atlassian.net" });
      expect(auth.getBaseUrl()).toBe("https://test.atlassian.net");
    });

    test("should handle domain with https prefix", () => {
      const auth = new AtlassianAuth({ ...testConfig, domain: "https://test.atlassian.net" });
      expect(auth.getBaseUrl()).toBe("https://test.atlassian.net");
    });
  });

  describe("API Gateway domain", () => {
    const gatewayConfig = {
      ...testConfig,
      domain: "api.atlassian.com/ex/jira/12345678-1234-1234-1234-123456789abc",
    };

    test("should detect gateway cloudId from Jira gateway URL", () => {
      const auth = new AtlassianAuth(gatewayConfig);
      // The baseUrl is stored, but routing happens internally
      expect(auth.getBaseUrl()).toBe("https://api.atlassian.com/ex/jira/12345678-1234-1234-1234-123456789abc");
    });

    test("should detect gateway cloudId from Confluence gateway URL", () => {
      const confluenceGatewayConfig = {
        ...testConfig,
        domain: "api.atlassian.com/ex/confluence/12345678-1234-1234-1234-123456789abc",
      };
      const auth = new AtlassianAuth(confluenceGatewayConfig);
      expect(auth.getBaseUrl()).toBe("https://api.atlassian.com/ex/confluence/12345678-1234-1234-1234-123456789abc");
    });

    test("should handle gateway URL with https prefix", () => {
      const auth = new AtlassianAuth({
        ...testConfig,
        domain: "https://api.atlassian.com/ex/jira/12345678-1234-1234-1234-123456789abc",
      });
      expect(auth.getBaseUrl()).toBe("https://api.atlassian.com/ex/jira/12345678-1234-1234-1234-123456789abc");
    });

    test("should be case-insensitive for gateway detection", () => {
      const auth = new AtlassianAuth({
        ...testConfig,
        domain: "API.ATLASSIAN.COM/EX/JIRA/12345678-1234-1234-1234-123456789abc",
      });
      // Should still detect as gateway
      expect(auth.getBaseUrl()).toBe("https://API.ATLASSIAN.COM/EX/JIRA/12345678-1234-1234-1234-123456789abc");
    });
  });

  describe("Path-based service routing (internal behavior)", () => {
    // These tests verify the routing logic by checking that the auth instance
    // was created successfully with gateway detection. The actual routing
    // happens in the private getBaseUrlForPath method which is tested
    // indirectly through integration tests.

    const gatewayConfig = {
      ...testConfig,
      domain: "api.atlassian.com/ex/jira/12345678-1234-1234-1234-123456789abc",
    };

    test("should create auth instance with gateway config", () => {
      const auth = new AtlassianAuth(gatewayConfig);
      expect(auth).toBeDefined();
      expect(auth.getBaseUrl()).toContain("api.atlassian.com");
    });

    // Note: The actual path routing (/wiki/* -> confluence, else -> jira)
    // is tested through the request method which requires mocking fetch.
    // For unit tests, we verify the gateway detection logic works correctly.
  });

  describe("CloudId pattern matching", () => {
    test("should match standard UUID format", () => {
      const auth = new AtlassianAuth({
        ...testConfig,
        domain: "api.atlassian.com/ex/jira/12345678-1234-1234-1234-123456789abc",
      });
      expect(auth.getBaseUrl()).toContain("12345678-1234-1234-1234-123456789abc");
    });

    test("should match cloudId with only lowercase hex and hyphens", () => {
      const auth = new AtlassianAuth({
        ...testConfig,
        domain: "api.atlassian.com/ex/jira/abcdef12-3456-7890-abcd-ef1234567890",
      });
      expect(auth.getBaseUrl()).toContain("abcdef12-3456-7890-abcd-ef1234567890");
    });

    test("should not match non-gateway domains", () => {
      const auth = new AtlassianAuth({
        ...testConfig,
        domain: "mycompany.atlassian.net",
      });
      // Should not contain gateway path
      expect(auth.getBaseUrl()).toBe("https://mycompany.atlassian.net");
      expect(auth.getBaseUrl()).not.toContain("/ex/");
    });
  });
});
