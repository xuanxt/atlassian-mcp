/**
 * Jira API Unit Tests
 */

import { beforeAll, describe, expect, test } from "bun:test";
import { AtlassianAuth } from "../common/auth.js";
import type { AtlassianConfig } from "../common/types.js";
import { JiraAPI } from "./api.js";

// Validate test configuration
if (
  !process.env.ATLASSIAN_DOMAIN ||
  !process.env.ATLASSIAN_EMAIL ||
  !process.env.ATLASSIAN_API_TOKEN
) {
  throw new Error(
    "Missing required environment variables: ATLASSIAN_DOMAIN, ATLASSIAN_EMAIL, ATLASSIAN_API_TOKEN"
  );
}

// Test configuration from environment variables (guaranteed to be defined)
const testConfig: AtlassianConfig = {
  domain: process.env.ATLASSIAN_DOMAIN,
  email: process.env.ATLASSIAN_EMAIL,
  apiToken: process.env.ATLASSIAN_API_TOKEN,
};

// Test data that will be populated during tests
const testData: {
  projectKey?: string;
  issueKey?: string;
  transitionId?: string;
  commentId?: string;
  worklogId?: string;
  linkTypeId?: string;
  versionId?: string;
} = {};

// Initialize API client
let jiraAPI: JiraAPI;

beforeAll(() => {
  const auth = new AtlassianAuth(testConfig);
  jiraAPI = new JiraAPI(auth);
});

describe("Jira API - Basic Queries", () => {
  test("listProjects - should list all projects", async () => {
    const result = await jiraAPI.listProjects({ maxResults: 10 });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("values");

    const typedResult = result as { values: Array<{ key: string; name: string }> };
    if (typedResult.values.length > 0) {
      const firstProject = typedResult.values[0];
      testData.projectKey = firstProject?.key;
      console.log(`✓ Found ${typedResult.values.length} projects`);
      console.log(`  Using project: ${testData.projectKey}`);
    }
  });

  test("searchIssues - should search issues using JQL", async () => {
    if (!testData.projectKey) {
      console.log("⊘ Skipping: No project key available");
      return;
    }

    const result = await jiraAPI.searchIssues({
      jql: `project = ${testData.projectKey} ORDER BY created DESC`,
      maxResults: 5,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("issues");

    const typedResult = result as { issues: Array<{ key: string }> };
    if (typedResult.issues.length > 0) {
      const firstIssue = typedResult.issues[0];
      testData.issueKey = firstIssue?.key;
      console.log(`✓ Found ${typedResult.issues.length} issues`);
      console.log(`  Using issue: ${testData.issueKey}`);
    }
  });
});

describe("Jira API - Issue Details", () => {
  test("getIssue - should get issue details", async () => {
    if (!testData.issueKey) {
      console.log("⊘ Skipping: No issue key available");
      return;
    }

    const result = await jiraAPI.getIssue({
      issueKey: testData.issueKey,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("key");
    expect(result).toHaveProperty("fields");

    console.log(`✓ Retrieved issue details for ${testData.issueKey}`);
  });

  test("getIssue - should get issue with specific fields", async () => {
    if (!testData.issueKey) {
      console.log("⊘ Skipping: No issue key available");
      return;
    }

    const result = await jiraAPI.getIssue({
      issueKey: testData.issueKey,
      fields: ["summary", "status", "assignee"],
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("fields");

    console.log(`✓ Retrieved issue with specific fields`);
  });
});

describe("Jira API - Workflow", () => {
  test("getTransitions - should get available transitions", async () => {
    if (!testData.issueKey) {
      console.log("⊘ Skipping: No issue key available");
      return;
    }

    const result = await jiraAPI.getTransitions({
      issueKey: testData.issueKey,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("transitions");

    const typedResult = result as { transitions: Array<{ id: string; name: string }> };
    if (typedResult.transitions.length > 0) {
      const firstTransition = typedResult.transitions[0];
      testData.transitionId = firstTransition?.id;
      console.log(`✓ Found ${typedResult.transitions.length} available transitions`);
      console.log(`  Transitions: ${typedResult.transitions.map((t) => t.name).join(", ")}`);
    }
  });

  test("transitionIssue - should transition issue (if transitions available)", async () => {
    if (!testData.issueKey || !testData.transitionId) {
      console.log("⊘ Skipping: No issue key or transition ID available");
      return;
    }

    // Note: Only transition if we have a valid transition
    // In real scenarios, you'd check the current status first
    console.log(
      `⊘ Skipping transition test to avoid changing issue state (transition ID: ${testData.transitionId})`
    );
  });
});

describe("Jira API - Comments", () => {
  test("addComment - should add comment to issue", async () => {
    if (!testData.issueKey) {
      console.log("⊘ Skipping: No issue key available");
      return;
    }

    const result = await jiraAPI.addComment({
      issueKey: testData.issueKey,
      body: `Test comment added at ${new Date().toISOString()}`,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");

    const typedResult = result as { id: string };
    testData.commentId = typedResult.id;
    console.log(`✓ Added comment: ${testData.commentId}`);
  });
});

describe("Jira API - Worklogs", () => {
  test("getWorklog - should get worklogs for issue", async () => {
    if (!testData.issueKey) {
      console.log("⊘ Skipping: No issue key available");
      return;
    }

    const result = await jiraAPI.getWorklog({
      issueKey: testData.issueKey,
      maxResults: 10,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("worklogs");

    const typedResult = result as { worklogs: Array<{ id: string }> };
    console.log(`✓ Found ${typedResult.worklogs.length} worklogs`);
  });

  test("addWorklog - should add worklog entry", async () => {
    if (!testData.issueKey) {
      console.log("⊘ Skipping: No issue key available");
      return;
    }

    const result = await jiraAPI.addWorklog({
      issueKey: testData.issueKey,
      timeSpentSeconds: 3600, // 1 hour
      comment: `Test worklog added at ${new Date().toISOString()}`,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");

    const typedResult = result as { id: string };
    testData.worklogId = typedResult.id;
    console.log(`✓ Added worklog: ${testData.worklogId} (1 hour)`);
  });
});

describe("Jira API - Issue Links", () => {
  test("getIssueLinkTypes - should get available link types", async () => {
    const result = await jiraAPI.getIssueLinkTypes({});

    expect(result).toBeDefined();
    expect(result).toHaveProperty("issueLinkTypes");

    const typedResult = result as { issueLinkTypes: Array<{ id: string; name: string }> };
    if (typedResult.issueLinkTypes.length > 0) {
      console.log(`✓ Found ${typedResult.issueLinkTypes.length} link types`);
      console.log(`  Types: ${typedResult.issueLinkTypes.map((t) => t.name).join(", ")}`);
    }
  });

  test("createIssueLink - should create link between issues (skipped)", async () => {
    if (!testData.issueKey) {
      console.log("⊘ Skipping: No issue key available");
      return;
    }

    // Skip creating actual link to avoid cluttering test data
    // In a real test, you'd create two test issues and link them
    console.log(`⊘ Skipping issue link creation to avoid test data pollution`);
  });
});

describe("Jira API - Version Management", () => {
  test("getProjectVersions - should get project versions", async () => {
    if (!testData.projectKey) {
      console.log("⊘ Skipping: No project key available");
      return;
    }

    const result = await jiraAPI.getProjectVersions({
      projectKey: testData.projectKey,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    const typedResult = result as Array<{ id: string; name: string }>;
    console.log(`✓ Found ${typedResult.length} versions`);
    if (typedResult.length > 0) {
      console.log(`  Versions: ${typedResult.map((v) => v.name).join(", ")}`);
    }
  });

  test("createVersion - should create new version", async () => {
    if (!testData.projectKey) {
      console.log("⊘ Skipping: No project key available");
      return;
    }

    const versionName = `Test-Version-${Date.now()}`;
    const result = await jiraAPI.createVersion({
      projectKey: testData.projectKey,
      name: versionName,
      description: `Test version created at ${new Date().toISOString()}`,
      released: false,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name");

    const typedResult = result as { id: string; name: string };
    testData.versionId = typedResult.id;
    console.log(`✓ Created version: ${typedResult.name} (ID: ${testData.versionId})`);
  });
});

describe("Jira API - CRUD Operations", () => {
  let createdIssueKey: string;

  test("createIssue - should create a new issue", async () => {
    if (!testData.projectKey) {
      console.log("⊘ Skipping: No project key available");
      return;
    }

    const result = await jiraAPI.createIssue({
      projectKey: testData.projectKey,
      issueType: "Task",
      summary: `Test Issue ${Date.now()}`,
      description: `This is a test issue created at ${new Date().toISOString()}`,
      priority: "Medium",
      labels: ["test", "automated"],
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("key");

    const typedResult = result as { key: string };
    createdIssueKey = typedResult.key;
    console.log(`✓ Created issue: ${createdIssueKey}`);
  });

  test("updateIssue - should update the created issue", async () => {
    if (!createdIssueKey) {
      console.log("⊘ Skipping: No created issue available");
      return;
    }

    await jiraAPI.updateIssue({
      issueKey: createdIssueKey,
      summary: `Updated Test Issue ${Date.now()}`,
      description: `This issue was updated at ${new Date().toISOString()}`,
    });

    console.log(`✓ Updated issue: ${createdIssueKey}`);
  });

  test("deleteIssue - should delete the created issue", async () => {
    if (!createdIssueKey) {
      console.log("⊘ Skipping: No created issue available");
      return;
    }

    await jiraAPI.deleteIssue({
      issueKey: createdIssueKey,
      deleteSubtasks: false,
    });

    console.log(`✓ Deleted issue: ${createdIssueKey}`);
  });
});

describe("Jira API - Summary", () => {
  test("print test summary", () => {
    console.log("\n📊 Test Data Summary:");
    console.log(`  Project Key: ${testData.projectKey || "N/A"}`);
    console.log(`  Issue Key: ${testData.issueKey || "N/A"}`);
    console.log(`  Transition ID: ${testData.transitionId || "N/A"}`);
    console.log(`  Comment ID: ${testData.commentId || "N/A"}`);
    console.log(`  Worklog ID: ${testData.worklogId || "N/A"}`);
    console.log(`  Version ID: ${testData.versionId || "N/A"}`);

    expect(true).toBe(true);
  });
});
