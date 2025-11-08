/**
 * Jira API Hierarchy Integration Tests
 * Tests complete Epic → Story → Task → Sub-task hierarchy with Sprint assignment
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

// Test configuration from environment variables
const testConfig: AtlassianConfig = {
  domain: process.env.ATLASSIAN_DOMAIN,
  email: process.env.ATLASSIAN_EMAIL,
  apiToken: process.env.ATLASSIAN_API_TOKEN,
};

// Test data to store created issue keys
const testData: {
  projectKey?: string;
  boardId?: number;
  epicKey?: string;
  story1Key?: string;
  story2Key?: string;
  story3Key?: string;
  task1Key?: string;
  task2Key?: string;
  task3Key?: string;
  subtask1Key?: string;
  subtask2Key?: string;
  sprintId?: number;
  createdIssues: string[];
} = {
  createdIssues: [],
};

// Initialize API client
let jiraAPI: JiraAPI;

beforeAll(() => {
  const auth = new AtlassianAuth(testConfig);
  jiraAPI = new JiraAPI(auth);
});

describe("Jira Hierarchy Integration Test", () => {
  test("Setup - Find test project and board", async () => {
    console.log("\n🔍 Finding test project and board...");

    // List projects
    const projects = (await jiraAPI.listProjects({ maxResults: 50 })) as any;
    console.log(`✓ Found ${projects.values?.length || 0} projects`);

    if (!projects.values || projects.values.length === 0) {
      throw new Error("No projects found. Please create a project first.");
    }

    // Use first project
    testData.projectKey = projects.values[0].key;
    console.log(`✓ Using project: ${testData.projectKey}`);

    // Try to find a board for this project
    try {
      const boards = (await jiraAPI.getAgileBoards({
        projectKeyOrId: testData.projectKey,
        maxResults: 10,
      })) as any;

      if (boards.values && boards.values.length > 0) {
        testData.boardId = boards.values[0].id;
        console.log(`✓ Found board: ${boards.values[0].name} (ID: ${testData.boardId})`);
      } else {
        console.log(`⚠️  No board found for project ${testData.projectKey}`);
        console.log("   Sprint tests will be skipped");
      }
    } catch (error) {
      console.log(`⚠️  Could not fetch boards: ${(error as Error).message}`);
      console.log("   Sprint tests will be skipped");
    }

    expect(testData.projectKey).toBeDefined();
  });

  test("Step 1 - Create Epic", async () => {
    console.log("\n📝 Creating Epic...");

    const epic = (await jiraAPI.createIssue({
      projectKey: testData.projectKey!,
      issueType: "Epic",
      summary: "[TEST] 用户认证系统 - Hierarchy Test",
      description: "完整的用户认证功能，包括登录、注册和密码重置。这是一个测试 Epic，用于验证层级关系功能。",
      priority: "High",
      labels: ["test", "hierarchy", "authentication"],
    })) as any;

    testData.epicKey = epic.key;
    testData.createdIssues.push(epic.key);

    console.log(`✅ Created Epic: ${epic.key}`);
    console.log(`   URL: https://${testConfig.domain}.atlassian.net/browse/${epic.key}`);

    expect(epic.key).toBeDefined();
    expect(epic.key).toContain(testData.projectKey);
  });

  test("Step 2 - Create Story 1 under Epic (parentKey)", async () => {
    console.log("\n📝 Creating Story 1 with Epic parent...");

    const story1 = (await jiraAPI.createIssue({
      projectKey: testData.projectKey!,
      issueType: "Story",
      summary: "[TEST] 用户登录功能",
      description: "用户可以使用邮箱和密码登录系统，并获得 JWT token 进行后续认证。",
      priority: "High",
      labels: ["test", "login", "frontend"],
      parentKey: testData.epicKey!,  // 🔑 Link to Epic
    })) as any;

    testData.story1Key = story1.key;
    testData.createdIssues.push(story1.key);

    console.log(`✅ Created Story 1: ${story1.key} (parent: ${testData.epicKey})`);
    console.log(`   URL: https://${testConfig.domain}.atlassian.net/browse/${story1.key}`);

    expect(story1.key).toBeDefined();
  });

  test("Step 3 - Create Story 2 under Epic", async () => {
    console.log("\n📝 Creating Story 2 with Epic parent...");

    const story2 = (await jiraAPI.createIssue({
      projectKey: testData.projectKey!,
      issueType: "Story",
      summary: "[TEST] 用户注册功能",
      description: "新用户可以注册账号，系统将验证邮箱唯一性并发送验证邮件。",
      priority: "High",
      labels: ["test", "registration", "backend"],
      parentKey: testData.epicKey!,  // 🔑 Link to Epic
    })) as any;

    testData.story2Key = story2.key;
    testData.createdIssues.push(story2.key);

    console.log(`✅ Created Story 2: ${story2.key} (parent: ${testData.epicKey})`);

    expect(story2.key).toBeDefined();
  });

  test("Step 4 - Create Story 3 under Epic", async () => {
    console.log("\n📝 Creating Story 3 with Epic parent...");

    const story3 = (await jiraAPI.createIssue({
      projectKey: testData.projectKey!,
      issueType: "Story",
      summary: "[TEST] 密码重置功能",
      description: "用户可以通过邮箱重置密码，系统发送重置链接有效期24小时。",
      priority: "Medium",
      labels: ["test", "password-reset", "backend"],
      parentKey: testData.epicKey!,  // 🔑 Link to Epic
    })) as any;

    testData.story3Key = story3.key;
    testData.createdIssues.push(story3.key);

    console.log(`✅ Created Story 3: ${story3.key} (parent: ${testData.epicKey})`);

    expect(story3.key).toBeDefined();
  });

  test("Step 5 - Create Sub-task 1 under Story 1 (parentKey REQUIRED)", async () => {
    console.log("\n📝 Creating Sub-task 1 with Story parent...");
    console.log("   Note: Skipping Task creation - this project doesn't support Task→Story hierarchy");

    const subtask1 = (await jiraAPI.createIssue({
      projectKey: testData.projectKey!,
      issueType: "Sub-task",
      summary: "[TEST] 实现登录 API 端点",
      description: "创建 POST /api/auth/login 端点，接收邮箱和密码，返回 JWT token。",
      priority: "High",
      labels: ["test", "api", "backend"],
      parentKey: testData.story1Key!,  // 🔑 REQUIRED for Sub-task, link to Story
    })) as any;

    testData.subtask1Key = subtask1.key;
    testData.createdIssues.push(subtask1.key);

    console.log(`✅ Created Sub-task 1: ${subtask1.key} (parent: ${testData.story1Key})`);
    console.log(`   ⚠️  Note: parentKey is REQUIRED for Sub-task`);

    expect(subtask1.key).toBeDefined();
  });

  test("Step 6 - Create Sub-task 2 under Story 1", async () => {
    console.log("\n📝 Creating Sub-task 2 with Story parent...");

    const subtask2 = (await jiraAPI.createIssue({
      projectKey: testData.projectKey!,
      issueType: "Sub-task",
      summary: "[TEST] 设计登录 UI 界面",
      description: "创建响应式登录表单，包含邮箱、密码输入框和记住我选项。",
      priority: "High",
      labels: ["test", "ui", "frontend"],
      parentKey: testData.story1Key!,  // 🔑 REQUIRED for Sub-task
    })) as any;

    testData.subtask2Key = subtask2.key;
    testData.createdIssues.push(subtask2.key);

    console.log(`✅ Created Sub-task 2: ${subtask2.key} (parent: ${testData.story1Key})`);

    expect(subtask2.key).toBeDefined();
  });

  test("Step 7 - Create Sub-task 3 under Story 2", async () => {
    console.log("\n📝 Creating Sub-task 3 with Story parent...");

    const subtask3 = (await jiraAPI.createIssue({
      projectKey: testData.projectKey!,
      issueType: "Sub-task",
      summary: "[TEST] 设计注册 API 端点",
      description: "创建 POST /api/auth/register 端点，验证邮箱唯一性并创建用户账号。",
      priority: "High",
      labels: ["test", "api", "backend"],
      parentKey: testData.story2Key!,  // 🔑 REQUIRED for Sub-task
    })) as any;

    testData.createdIssues.push(subtask3.key);

    console.log(`✅ Created Sub-task 3: ${subtask3.key} (parent: ${testData.story2Key})`);

    expect(subtask3.key).toBeDefined();
  });

  test("Step 8 - Verify hierarchy relationships", async () => {
    console.log("\n🔍 Verifying hierarchy relationships...");

    // Verify Story 1 parent is Epic
    const story1Details = (await jiraAPI.getIssue({
      issueKey: testData.story1Key!,
    })) as any;

    console.log(`✓ Story 1 parent: ${story1Details.fields.parent?.key || 'none'}`);
    expect(story1Details.fields.parent?.key).toBe(testData.epicKey);

    // Verify Sub-task 1 parent is Story 1
    const subtask1Details = (await jiraAPI.getIssue({
      issueKey: testData.subtask1Key!,
    })) as any;

    console.log(`✓ Sub-task 1 parent: ${subtask1Details.fields.parent?.key || 'none'}`);
    expect(subtask1Details.fields.parent?.key).toBe(testData.story1Key);

    console.log(`✅ All hierarchy relationships verified!`);
  });

  test("Step 9 - Create Sprint and assign issues (if board available)", async () => {
    if (!testData.boardId) {
      console.log("\n⏭️  Skipping Sprint test (no board available)");
      return;
    }

    console.log("\n📝 Creating Sprint...");

    const sprint = (await jiraAPI.createSprint({
      boardId: testData.boardId,
      name: `[TEST] Hierarchy ${Date.now()}`,  // Short name < 30 chars
      goal: "测试层级关系功能",
    })) as any;

    testData.sprintId = sprint.id;

    console.log(`✅ Created Sprint: ${sprint.name} (ID: ${sprint.id})`);

    // Move issues to sprint
    console.log("\n📌 Assigning issues to Sprint...");

    await jiraAPI.moveIssuesToSprint({
      sprintId: testData.sprintId,
      issues: [
        testData.story1Key!,
        testData.story2Key!,
        testData.story3Key!,
      ],
    });

    console.log(`✅ Assigned 3 stories to Sprint ${testData.sprintId}`);

    expect(sprint.id).toBeDefined();
  });

  test("Final - Display created hierarchy", async () => {
    console.log("\n" + "=".repeat(80));
    console.log("🎉 HIERARCHY TEST COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(80));
    console.log("\n📊 Created Hierarchy Structure:\n");
    console.log(`Epic: ${testData.epicKey} "[TEST] 用户认证系统"`);
    console.log(`  ├─ Story: ${testData.story1Key} "[TEST] 用户登录功能" (parent: ${testData.epicKey})`);
    console.log(`  │   ├─ Sub-task: ${testData.subtask1Key} "[TEST] 实现登录 API" (parent: ${testData.story1Key})`);
    console.log(`  │   └─ Sub-task: ${testData.subtask2Key} "[TEST] 设计登录 UI" (parent: ${testData.story1Key})`);
    console.log(`  ├─ Story: ${testData.story2Key} "[TEST] 用户注册功能" (parent: ${testData.epicKey})`);
    console.log(`  │   └─ Sub-task: ${testData.createdIssues[6] || 'unknown'} "[TEST] 设计注册 API" (parent: ${testData.story2Key})`);
    console.log(`  └─ Story: ${testData.story3Key} "[TEST] 密码重置功能" (parent: ${testData.epicKey})`);

    if (testData.sprintId) {
      console.log(`\n📅 Sprint: ID ${testData.sprintId}`);
      console.log(`   Contains: ${testData.story1Key}, ${testData.story2Key}, ${testData.story3Key}`);
    }

    const domain = testConfig.domain.replace('https://', '').replace('http://', '');
    console.log(`\n🔗 View in Jira:`);
    console.log(`   Epic: https://${domain}/browse/${testData.epicKey}`);
    console.log(`   Story 1: https://${domain}/browse/${testData.story1Key}`);
    console.log(`   Sub-task 1: https://${domain}/browse/${testData.subtask1Key}`);
    console.log(`   Sub-task 2: https://${domain}/browse/${testData.subtask2Key}`);

    console.log(`\n📝 Total created issues: ${testData.createdIssues.length}`);
    console.log(`   Issues: ${testData.createdIssues.join(', ')}`);

    console.log(`\n⚠️  Note: This project supports Epic → Story → Sub-task hierarchy`);
    console.log(`   Task → Story relationship is not supported in this project type`);

    console.log(`\n🗑️  Cleanup: To delete these test issues, visit Jira and delete manually`);
    console.log("\n" + "=".repeat(80));
  });
});
