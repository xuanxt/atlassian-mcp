import { afterAll, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadConfig, loadConfigFile } from "./config.js";

describe("Config Loading", () => {
  const testDir = join(tmpdir(), `atlassian-mcp-test-${Date.now()}`);

  // Setup test directory
  if (!existsSync(testDir)) {
    mkdirSync(testDir, { recursive: true });
  }

  // Cleanup after all tests
  afterAll(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  test("loadConfigFile - should load valid config file", () => {
    const configPath = join(testDir, "test-config.json");
    const testConfig = {
      domain: "test.atlassian.net",
      email: "test@example.com",
      apiToken: "test-token-123",
    };

    writeFileSync(configPath, JSON.stringify(testConfig, null, 2));

    const result = loadConfigFile(configPath);
    expect(result).toEqual(testConfig);
  });

  test("loadConfigFile - should return null for non-existent file", () => {
    const result = loadConfigFile(join(testDir, "non-existent.json"));
    expect(result).toBeNull();
  });

  test("loadConfigFile - should throw error for invalid JSON", () => {
    const configPath = join(testDir, "invalid.json");
    writeFileSync(configPath, "{ invalid json }");

    expect(() => loadConfigFile(configPath)).toThrow();
  });

  test("loadConfigFile - should throw error for missing required fields", () => {
    const configPath = join(testDir, "incomplete.json");
    writeFileSync(configPath, JSON.stringify({ domain: "test.atlassian.net" }));

    expect(() => loadConfigFile(configPath)).toThrow("missing required fields");
  });

  test("loadConfig - should load from config file", () => {
    const configPath = join(testDir, "valid-config.json");
    const testConfig = {
      domain: "file.atlassian.net",
      email: "file@example.com",
      apiToken: "file-token",
    };

    writeFileSync(configPath, JSON.stringify(testConfig, null, 2));

    // Clear environment variables for this test
    const originalEnv = {
      ATLASSIAN_DOMAIN: process.env.ATLASSIAN_DOMAIN,
      ATLASSIAN_EMAIL: process.env.ATLASSIAN_EMAIL,
      ATLASSIAN_API_TOKEN: process.env.ATLASSIAN_API_TOKEN,
    };

    delete process.env.ATLASSIAN_DOMAIN;
    delete process.env.ATLASSIAN_EMAIL;
    delete process.env.ATLASSIAN_API_TOKEN;

    const result = loadConfig({ configPath });
    expect(result).toEqual(testConfig);

    // Restore original environment
    process.env.ATLASSIAN_DOMAIN = originalEnv.ATLASSIAN_DOMAIN;
    process.env.ATLASSIAN_EMAIL = originalEnv.ATLASSIAN_EMAIL;
    process.env.ATLASSIAN_API_TOKEN = originalEnv.ATLASSIAN_API_TOKEN;
  });

  test("loadConfig - should prioritize command-line args over config file", () => {
    const configPath = join(testDir, "priority-test.json");
    const fileConfig = {
      domain: "file.atlassian.net",
      email: "file@example.com",
      apiToken: "file-token",
    };

    writeFileSync(configPath, JSON.stringify(fileConfig, null, 2));

    const result = loadConfig({
      configPath,
      domain: "cli.atlassian.net",
      email: "cli@example.com",
      apiToken: "cli-token",
    });

    expect(result.domain).toBe("cli.atlassian.net");
    expect(result.email).toBe("cli@example.com");
    expect(result.apiToken).toBe("cli-token");
  });

  test("loadConfig - should use environment variables over config file", () => {
    const configPath = join(testDir, "env-test.json");
    const fileConfig = {
      domain: "file.atlassian.net",
      email: "file@example.com",
      apiToken: "file-token",
    };

    writeFileSync(configPath, JSON.stringify(fileConfig, null, 2));

    // Set environment variables
    const originalEnv = {
      ATLASSIAN_DOMAIN: process.env.ATLASSIAN_DOMAIN,
      ATLASSIAN_EMAIL: process.env.ATLASSIAN_EMAIL,
      ATLASSIAN_API_TOKEN: process.env.ATLASSIAN_API_TOKEN,
    };

    process.env.ATLASSIAN_DOMAIN = "env.atlassian.net";
    process.env.ATLASSIAN_EMAIL = "env@example.com";
    process.env.ATLASSIAN_API_TOKEN = "env-token";

    const result = loadConfig({ configPath });

    expect(result.domain).toBe("env.atlassian.net");
    expect(result.email).toBe("env@example.com");
    expect(result.apiToken).toBe("env-token");

    // Restore original environment
    process.env.ATLASSIAN_DOMAIN = originalEnv.ATLASSIAN_DOMAIN;
    process.env.ATLASSIAN_EMAIL = originalEnv.ATLASSIAN_EMAIL;
    process.env.ATLASSIAN_API_TOKEN = originalEnv.ATLASSIAN_API_TOKEN;
  });

  test("loadConfig - should throw error when no config provided", () => {
    // Clear environment variables
    const originalEnv = {
      ATLASSIAN_DOMAIN: process.env.ATLASSIAN_DOMAIN,
      ATLASSIAN_EMAIL: process.env.ATLASSIAN_EMAIL,
      ATLASSIAN_API_TOKEN: process.env.ATLASSIAN_API_TOKEN,
    };

    delete process.env.ATLASSIAN_DOMAIN;
    delete process.env.ATLASSIAN_EMAIL;
    delete process.env.ATLASSIAN_API_TOKEN;

    expect(() => loadConfig({})).toThrow("Missing required configuration");

    // Restore original environment
    process.env.ATLASSIAN_DOMAIN = originalEnv.ATLASSIAN_DOMAIN;
    process.env.ATLASSIAN_EMAIL = originalEnv.ATLASSIAN_EMAIL;
    process.env.ATLASSIAN_API_TOKEN = originalEnv.ATLASSIAN_API_TOKEN;
  });

  test("loadConfig - should handle tilde expansion in config path", () => {
    const homeConfigPath = join(testDir, ".atlassian-mcp.json");
    const testConfig = {
      domain: "home.atlassian.net",
      email: "home@example.com",
      apiToken: "home-token",
    };

    writeFileSync(homeConfigPath, JSON.stringify(testConfig, null, 2));

    // Clear environment variables for this test
    const originalEnv = {
      ATLASSIAN_DOMAIN: process.env.ATLASSIAN_DOMAIN,
      ATLASSIAN_EMAIL: process.env.ATLASSIAN_EMAIL,
      ATLASSIAN_API_TOKEN: process.env.ATLASSIAN_API_TOKEN,
    };

    delete process.env.ATLASSIAN_DOMAIN;
    delete process.env.ATLASSIAN_EMAIL;
    delete process.env.ATLASSIAN_API_TOKEN;

    // Test with absolute path (since we can't easily test ~ expansion)
    const result = loadConfig({ configPath: homeConfigPath });
    expect(result).toEqual(testConfig);

    // Restore original environment
    process.env.ATLASSIAN_DOMAIN = originalEnv.ATLASSIAN_DOMAIN;
    process.env.ATLASSIAN_EMAIL = originalEnv.ATLASSIAN_EMAIL;
    process.env.ATLASSIAN_API_TOKEN = originalEnv.ATLASSIAN_API_TOKEN;
  });
});
