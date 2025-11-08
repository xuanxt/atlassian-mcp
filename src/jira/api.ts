/**
 * Jira API client
 */

import type { AtlassianAuth } from "../common/auth.js";

export interface ListProjectsParams {
  maxResults?: number;
  startAt?: number;
}

export interface SearchIssuesParams {
  jql: string;
  maxResults?: number;
  nextPageToken?: string;
  fields?: string[];
}

export interface CreateIssueParams {
  projectKey: string;
  issueType: string;
  summary: string;
  description?: string;
  priority?: string;
  labels?: string[];
  assignee?: string;
  parentKey?: string;
}

export interface UpdateIssueParams {
  issueKey: string;
  summary?: string;
  description?: string;
  priority?: string;
  labels?: string[];
  assignee?: string;
  parentKey?: string;
}

export interface DeleteIssueParams {
  issueKey: string;
  deleteSubtasks?: boolean;
}

export interface GetIssueParams {
  issueKey: string;
  fields?: string[];
  expand?: string[];
}

export interface GetTransitionsParams {
  issueKey: string;
}

export interface TransitionIssueParams {
  issueKey: string;
  transitionId: string;
  comment?: string;
}

export interface AddCommentParams {
  issueKey: string;
  body: string;
}

export interface GetWorklogParams {
  issueKey: string;
  maxResults?: number;
  startAt?: number;
}

export interface AddWorklogParams {
  issueKey: string;
  timeSpentSeconds: number;
  comment?: string;
  started?: string;
}

export type GetIssueLinkTypesParams = Record<string, never>;

export interface CreateIssueLinkParams {
  type: string;
  inwardIssue: string;
  outwardIssue: string;
  comment?: string;
}

export interface GetProjectVersionsParams {
  projectKey: string;
}

export interface CreateVersionParams {
  projectKey: string;
  name: string;
  description?: string;
  releaseDate?: string;
  released?: boolean;
}

export interface GetProjectIssuesParams {
  projectKey: string;
  maxResults?: number;
  startAt?: number;
  fields?: string[];
}

export interface SearchFieldsParams {
  query?: string;
  maxResults?: number;
  startAt?: number;
}

export interface GetAgileBoardsParams {
  projectKeyOrId?: string;
  maxResults?: number;
  startAt?: number;
}

export interface GetBoardIssuesParams {
  boardId: number;
  maxResults?: number;
  startAt?: number;
  jql?: string;
}

export interface GetSprintsFromBoardParams {
  boardId: number;
  maxResults?: number;
  startAt?: number;
  state?: string;
}

export interface GetSprintIssuesParams {
  sprintId: number;
  maxResults?: number;
  startAt?: number;
  fields?: string[];
}

export interface BatchGetChangelogsParams {
  issueKeys: string[];
}

export interface GetUserProfileParams {
  accountId: string;
}

export interface DownloadAttachmentsParams {
  attachmentId: string;
}

export interface BatchCreateIssuesParams {
  issues: Array<{
    projectKey: string;
    issueType: string;
    summary: string;
    description?: string;
    priority?: string;
    labels?: string[];
    assignee?: string;
  }>;
}

export interface LinkToEpicParams {
  epicKey: string;
  issueKeys: string[];
}

export interface CreateSprintParams {
  boardId: number;
  name: string;
  startDate?: string;
  endDate?: string;
  goal?: string;
}

export interface UpdateSprintParams {
  sprintId: number;
  name?: string;
  startDate?: string;
  endDate?: string;
  goal?: string;
  state?: string;
}

export interface DeleteSprintParams {
  sprintId: number;
}

export interface CreateBoardParams {
  name: string;
  type: "scrum" | "kanban";
  projectKeyOrId: string;
  filterId?: number;
}

export interface UpdateBoardParams {
  boardId: number;
  name?: string;
  filterId?: number;
}

export interface DeleteBoardParams {
  boardId: number;
}

export interface RankBacklogIssuesParams {
  issueKeys: string[];
  rankBeforeIssue?: string;
  rankAfterIssue?: string;
}

export interface RemoveIssueLinkParams {
  linkId: string;
}

export interface BatchCreateVersionsParams {
  projectKey: string;
  versions: Array<{
    name: string;
    description?: string;
    releaseDate?: string;
    released?: boolean;
  }>;
}

export interface MoveIssuesToSprintParams {
  sprintId: number;
  issues: string[];
}

export interface GetBacklogIssuesParams {
  boardId: number;
  maxResults?: number;
  startAt?: number;
  jql?: string;
  fields?: string[];
}

export interface GetEpicIssuesParams {
  epicIdOrKey: string;
  maxResults?: number;
  startAt?: number;
  fields?: string[];
}

export class JiraAPI {
  constructor(private readonly auth: AtlassianAuth) {}

  /**
   * List all Jira projects
   */
  async listProjects(params: ListProjectsParams = {}): Promise<unknown> {
    const maxResults = params.maxResults || 50;
    const startAt = params.startAt || 0;
    return this.auth.request(
      `/rest/api/3/project/search?maxResults=${maxResults}&startAt=${startAt}`
    );
  }

  /**
   * Search for issues using JQL
   */
  async searchIssues(params: SearchIssuesParams): Promise<unknown> {
    const {
      jql,
      maxResults = 50,
      nextPageToken,
      fields = ["summary", "status", "assignee", "created", "updated"],
    } = params;

    const payload: {
      jql: string;
      maxResults: number;
      fields: string[];
      nextPageToken?: string;
    } = {
      jql,
      maxResults,
      fields,
    };

    // Add nextPageToken for pagination if provided
    if (nextPageToken) {
      payload.nextPageToken = nextPageToken;
    }

    // Using the new /rest/api/3/search/jql endpoint as /rest/api/3/search is deprecated
    return this.auth.request("/rest/api/3/search/jql", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Create a new Jira issue
   */
  async createIssue(params: CreateIssueParams): Promise<unknown> {
    const { projectKey, issueType, summary, description, priority, labels = [], assignee, parentKey } = params;

    const fields: {
      project: { key: string };
      issuetype: { name: string };
      summary: string;
      description?: {
        type: string;
        version: number;
        content: Array<{
          type: string;
          content: Array<{ type: string; text: string }>;
        }>;
      };
      priority?: { name: string };
      labels?: string[];
      assignee?: { accountId: string };
      parent?: { key: string };
    } = {
      project: { key: projectKey },
      issuetype: { name: issueType },
      summary,
    };

    if (description) {
      fields.description = {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: description,
              },
            ],
          },
        ],
      };
    }

    if (priority) {
      fields.priority = { name: priority };
    }

    if (labels.length > 0) {
      fields.labels = labels;
    }

    if (assignee) {
      fields.assignee = { accountId: assignee };
    }

    if (parentKey) {
      fields.parent = { key: parentKey };
    }

    return this.auth.request("/rest/api/3/issue", {
      method: "POST",
      body: JSON.stringify({ fields }),
    });
  }

  /**
   * Update an existing Jira issue
   */
  async updateIssue(params: UpdateIssueParams): Promise<void> {
    const { issueKey, summary, description, priority, labels, assignee, parentKey } = params;

    const fields: {
      summary?: string;
      description?: {
        type: string;
        version: number;
        content: Array<{
          type: string;
          content: Array<{ type: string; text: string }>;
        }>;
      };
      priority?: { name: string };
      labels?: string[];
      assignee?: { accountId: string };
      parent?: { key: string };
    } = {};

    if (summary) {
      fields.summary = summary;
    }

    if (description) {
      fields.description = {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: description,
              },
            ],
          },
        ],
      };
    }

    if (priority) {
      fields.priority = { name: priority };
    }

    if (labels) {
      fields.labels = labels;
    }

    if (assignee) {
      fields.assignee = { accountId: assignee };
    }

    if (parentKey) {
      fields.parent = { key: parentKey };
    }

    await this.auth.request(`/rest/api/3/issue/${issueKey}`, {
      method: "PUT",
      body: JSON.stringify({ fields }),
    });
  }

  /**
   * Delete a Jira issue
   */
  async deleteIssue(params: DeleteIssueParams): Promise<void> {
    const { issueKey, deleteSubtasks = false } = params;
    let url = `/rest/api/3/issue/${issueKey}`;
    if (deleteSubtasks) {
      url += "?deleteSubtasks=true";
    }

    await this.auth.request(url, {
      method: "DELETE",
    });
  }

  /**
   * Get a single issue by key
   */
  async getIssue(params: GetIssueParams): Promise<unknown> {
    const { issueKey, fields, expand } = params;
    let url = `/rest/api/3/issue/${issueKey}`;

    const queryParams: string[] = [];
    if (fields && fields.length > 0) {
      queryParams.push(`fields=${fields.join(",")}`);
    }
    if (expand && expand.length > 0) {
      queryParams.push(`expand=${expand.join(",")}`);
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join("&")}`;
    }

    return this.auth.request(url);
  }

  /**
   * Get available transitions for an issue
   */
  async getTransitions(params: GetTransitionsParams): Promise<unknown> {
    const { issueKey } = params;
    return this.auth.request(`/rest/api/3/issue/${issueKey}/transitions`);
  }

  /**
   * Transition an issue to a new status
   */
  async transitionIssue(params: TransitionIssueParams): Promise<void> {
    const { issueKey, transitionId, comment } = params;

    const payload: {
      transition: { id: string };
      update?: {
        comment: Array<{
          add: {
            body: {
              type: string;
              version: number;
              content: Array<{
                type: string;
                content: Array<{ type: string; text: string }>;
              }>;
            };
          };
        }>;
      };
    } = {
      transition: { id: transitionId },
    };

    if (comment) {
      payload.update = {
        comment: [
          {
            add: {
              body: {
                type: "doc",
                version: 1,
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: comment,
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
      };
    }

    await this.auth.request(`/rest/api/3/issue/${issueKey}/transitions`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Add a comment to an issue
   */
  async addComment(params: AddCommentParams): Promise<unknown> {
    const { issueKey, body } = params;

    const payload = {
      body: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: body,
              },
            ],
          },
        ],
      },
    };

    return this.auth.request(`/rest/api/3/issue/${issueKey}/comment`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Get worklogs for an issue
   */
  async getWorklog(params: GetWorklogParams): Promise<unknown> {
    const { issueKey, maxResults = 1000, startAt = 0 } = params;
    return this.auth.request(
      `/rest/api/3/issue/${issueKey}/worklog?maxResults=${maxResults}&startAt=${startAt}`
    );
  }

  /**
   * Add a worklog entry to an issue
   */
  async addWorklog(params: AddWorklogParams): Promise<unknown> {
    const { issueKey, timeSpentSeconds, comment, started } = params;

    const payload: {
      timeSpentSeconds: number;
      comment?: {
        type: string;
        version: number;
        content: Array<{
          type: string;
          content: Array<{ type: string; text: string }>;
        }>;
      };
      started?: string;
    } = {
      timeSpentSeconds,
    };

    if (comment) {
      payload.comment = {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: comment,
              },
            ],
          },
        ],
      };
    }

    if (started) {
      payload.started = started;
    }

    return this.auth.request(`/rest/api/3/issue/${issueKey}/worklog`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Get all issue link types
   */
  async getIssueLinkTypes(_params: GetIssueLinkTypesParams): Promise<unknown> {
    return this.auth.request("/rest/api/3/issueLinkType");
  }

  /**
   * Create a link between two issues
   */
  async createIssueLink(params: CreateIssueLinkParams): Promise<void> {
    const { type, inwardIssue, outwardIssue, comment } = params;

    const payload: {
      type: { name: string };
      inwardIssue: { key: string };
      outwardIssue: { key: string };
      comment?: {
        body: {
          type: string;
          version: number;
          content: Array<{
            type: string;
            content: Array<{ type: string; text: string }>;
          }>;
        };
      };
    } = {
      type: { name: type },
      inwardIssue: { key: inwardIssue },
      outwardIssue: { key: outwardIssue },
    };

    if (comment) {
      payload.comment = {
        body: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: comment,
                },
              ],
            },
          ],
        },
      };
    }

    await this.auth.request("/rest/api/3/issueLink", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Get all versions for a project
   */
  async getProjectVersions(params: GetProjectVersionsParams): Promise<unknown> {
    const { projectKey } = params;
    return this.auth.request(`/rest/api/3/project/${projectKey}/versions`);
  }

  /**
   * Create a new version in a project
   */
  async createVersion(params: CreateVersionParams): Promise<unknown> {
    const { projectKey, name, description, releaseDate, released = false } = params;

    const payload: {
      name: string;
      project: string;
      description?: string;
      releaseDate?: string;
      released: boolean;
    } = {
      name,
      project: projectKey,
      released,
    };

    if (description) {
      payload.description = description;
    }

    if (releaseDate) {
      payload.releaseDate = releaseDate;
    }

    return this.auth.request("/rest/api/3/version", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Get all issues for a project
   */
  async getProjectIssues(params: GetProjectIssuesParams): Promise<unknown> {
    const { projectKey, maxResults = 50, fields } = params;
    const jql = `project = ${projectKey} ORDER BY created DESC`;
    return this.searchIssues({ jql, maxResults, fields });
  }

  /**
   * Search for custom fields
   */
  async searchFields(params: SearchFieldsParams): Promise<unknown> {
    const { query, maxResults = 50, startAt = 0 } = params;
    let url = `/rest/api/3/field/search?maxResults=${maxResults}&startAt=${startAt}`;
    if (query) {
      url += `&query=${encodeURIComponent(query)}`;
    }
    return this.auth.request(url);
  }

  /**
   * Get all agile boards
   */
  async getAgileBoards(params: GetAgileBoardsParams): Promise<unknown> {
    const { projectKeyOrId, maxResults = 50, startAt = 0 } = params;
    let url = `/rest/agile/1.0/board?maxResults=${maxResults}&startAt=${startAt}`;
    if (projectKeyOrId) {
      url += `&projectKeyOrId=${projectKeyOrId}`;
    }
    return this.auth.request(url);
  }

  /**
   * Create a new board
   */
  async createBoard(params: CreateBoardParams): Promise<unknown> {
    const { name, type, projectKeyOrId, filterId } = params;

    let actualFilterId = filterId;

    // If no filterId provided, create a default filter for the project
    if (!actualFilterId) {
      const filterPayload = {
        name: `Filter for ${name}`,
        jql: `project = ${projectKeyOrId} ORDER BY Rank ASC`,
        description: `Automatically created filter for board ${name}`,
      };

      const filter = (await this.auth.request("/rest/api/3/filter", {
        method: "POST",
        body: JSON.stringify(filterPayload),
      })) as { id: number };

      actualFilterId = filter.id;
    }

    const payload = {
      name,
      type,
      filterId: actualFilterId,
    };

    return this.auth.request("/rest/agile/1.0/board", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Update a board (Note: Jira Agile API has limited support for board updates)
   * Currently only supports updating board configuration, not basic properties like name
   */
  async updateBoard(params: UpdateBoardParams): Promise<unknown> {
    const { boardId, name, filterId } = params;

    // Note: The Jira Agile API does not support updating board name or filter
    // via the standard PUT endpoint. This method is kept for API completeness
    // but may return 405 (Method Not Allowed) errors.
    // To update board properties, you may need to use board configuration endpoints
    // or recreate the board with new properties.

    const payload: {
      name?: string;
      filterId?: number;
    } = {};

    if (name) {
      payload.name = name;
    }

    if (filterId) {
      payload.filterId = filterId;
    }

    return this.auth.request(`/rest/agile/1.0/board/${boardId}/configuration`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Delete a board
   */
  async deleteBoard(params: DeleteBoardParams): Promise<void> {
    const { boardId } = params;

    await this.auth.request(`/rest/agile/1.0/board/${boardId}`, {
      method: "DELETE",
    });
  }

  /**
   * Get issues for a board
   */
  async getBoardIssues(params: GetBoardIssuesParams): Promise<unknown> {
    const { boardId, maxResults = 50, startAt = 0, jql } = params;
    let url = `/rest/agile/1.0/board/${boardId}/issue?maxResults=${maxResults}&startAt=${startAt}`;
    if (jql) {
      url += `&jql=${encodeURIComponent(jql)}`;
    }
    return this.auth.request(url);
  }

  /**
   * Get sprints from a board
   */
  async getSprintsFromBoard(params: GetSprintsFromBoardParams): Promise<unknown> {
    const { boardId, maxResults = 50, startAt = 0, state } = params;
    let url = `/rest/agile/1.0/board/${boardId}/sprint?maxResults=${maxResults}&startAt=${startAt}`;
    if (state) {
      url += `&state=${state}`;
    }
    return this.auth.request(url);
  }

  /**
   * Get issues in a sprint
   */
  async getSprintIssues(params: GetSprintIssuesParams): Promise<unknown> {
    const { sprintId, maxResults = 50, startAt = 0, fields } = params;
    let url = `/rest/agile/1.0/sprint/${sprintId}/issue?maxResults=${maxResults}&startAt=${startAt}`;
    if (fields && fields.length > 0) {
      url += `&fields=${fields.join(",")}`;
    }
    return this.auth.request(url);
  }

  /**
   * Batch get changelogs for multiple issues
   */
  async batchGetChangelogs(params: BatchGetChangelogsParams): Promise<unknown> {
    const { issueKeys } = params;
    const changelogs = await Promise.all(
      issueKeys.map((key) =>
        this.getIssue({
          issueKey: key,
          expand: ["changelog"],
        })
      )
    );
    return changelogs;
  }

  /**
   * Get user profile by account ID
   */
  async getUserProfile(params: GetUserProfileParams): Promise<unknown> {
    const { accountId } = params;
    return this.auth.request(`/rest/api/3/user?accountId=${accountId}`);
  }

  /**
   * Download attachment (returns attachment URL)
   */
  async downloadAttachments(params: DownloadAttachmentsParams): Promise<unknown> {
    const { attachmentId } = params;
    return this.auth.request(`/rest/api/3/attachment/${attachmentId}`);
  }

  /**
   * Batch create multiple issues
   */
  async batchCreateIssues(params: BatchCreateIssuesParams): Promise<unknown> {
    const { issues } = params;

    const issueUpdates = issues.map((issue) => {
      const fields: {
        project: { key: string };
        issuetype: { name: string };
        summary: string;
        description?: {
          type: string;
          version: number;
          content: Array<{
            type: string;
            content: Array<{ type: string; text: string }>;
          }>;
        };
        priority?: { name: string };
        labels?: string[];
        assignee?: { accountId: string };
      } = {
        project: { key: issue.projectKey },
        issuetype: { name: issue.issueType },
        summary: issue.summary,
      };

      if (issue.description) {
        fields.description = {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: issue.description }],
            },
          ],
        };
      }

      if (issue.priority) {
        fields.priority = { name: issue.priority };
      }

      if (issue.labels && issue.labels.length > 0) {
        fields.labels = issue.labels;
      }

      if (issue.assignee) {
        fields.assignee = { accountId: issue.assignee };
      }

      return { fields };
    });

    return this.auth.request("/rest/api/3/issue/bulk", {
      method: "POST",
      body: JSON.stringify({ issueUpdates }),
    });
  }

  /**
   * Link issues to an epic
   */
  async linkToEpic(params: LinkToEpicParams): Promise<void> {
    const { epicKey, issueKeys } = params;

    // Use Jira Agile API to create Epic-Story links
    for (const issueKey of issueKeys) {
      await this.createIssueLink({
        type: "Epic-Story Link",
        inwardIssue: issueKey,
        outwardIssue: epicKey,
      });
    }
  }

  /**
   * Create a new sprint
   */
  async createSprint(params: CreateSprintParams): Promise<unknown> {
    const { boardId, name, startDate, endDate, goal } = params;

    const payload: {
      name: string;
      originBoardId: number;
      startDate?: string;
      endDate?: string;
      goal?: string;
    } = {
      name,
      originBoardId: boardId,
    };

    if (startDate) {
      payload.startDate = startDate;
    }

    if (endDate) {
      payload.endDate = endDate;
    }

    if (goal) {
      payload.goal = goal;
    }

    return this.auth.request("/rest/agile/1.0/sprint", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Update an existing sprint
   */
  async updateSprint(params: UpdateSprintParams): Promise<unknown> {
    const { sprintId, name, startDate, endDate, goal, state } = params;

    const payload: {
      name?: string;
      startDate?: string;
      endDate?: string;
      goal?: string;
      state?: string;
    } = {};

    if (name) {
      payload.name = name;
    }

    if (startDate) {
      payload.startDate = startDate;
    }

    if (endDate) {
      payload.endDate = endDate;
    }

    if (goal) {
      payload.goal = goal;
    }

    if (state) {
      payload.state = state;
    }

    return this.auth.request(`/rest/agile/1.0/sprint/${sprintId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Delete a sprint
   */
  async deleteSprint(params: DeleteSprintParams): Promise<void> {
    const { sprintId } = params;

    await this.auth.request(`/rest/agile/1.0/sprint/${sprintId}`, {
      method: "DELETE",
    });
  }

  /**
   * Move issues to a sprint
   */
  async moveIssuesToSprint(params: MoveIssuesToSprintParams): Promise<void> {
    const { sprintId, issues } = params;

    await this.auth.request(`/rest/agile/1.0/sprint/${sprintId}/issue`, {
      method: "POST",
      body: JSON.stringify({
        issues,
      }),
    });
  }

  /**
   * Get backlog issues for a board
   */
  async getBacklogIssues(params: GetBacklogIssuesParams): Promise<unknown> {
    const { boardId, maxResults = 50, startAt = 0, jql, fields } = params;
    let url = `/rest/agile/1.0/board/${boardId}/backlog?maxResults=${maxResults}&startAt=${startAt}`;

    if (jql) {
      url += `&jql=${encodeURIComponent(jql)}`;
    }

    if (fields && fields.length > 0) {
      url += `&fields=${fields.join(",")}`;
    }

    return this.auth.request(url);
  }

  /**
   * Rank/reorder issues in backlog
   */
  async rankBacklogIssues(params: RankBacklogIssuesParams): Promise<void> {
    const { issueKeys, rankBeforeIssue, rankAfterIssue } = params;

    // Rank each issue
    for (const issueKey of issueKeys) {
      const payload: {
        issues: string[];
        rankBeforeIssue?: string;
        rankAfterIssue?: string;
      } = {
        issues: [issueKey],
      };

      if (rankBeforeIssue) {
        payload.rankBeforeIssue = rankBeforeIssue;
      } else if (rankAfterIssue) {
        payload.rankAfterIssue = rankAfterIssue;
      }

      await this.auth.request("/rest/agile/1.0/issue/rank", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    }
  }

  /**
   * Get all issues in an epic
   */
  async getEpicIssues(params: GetEpicIssuesParams): Promise<unknown> {
    const { epicIdOrKey, maxResults = 50, startAt = 0, fields } = params;
    let url = `/rest/agile/1.0/epic/${epicIdOrKey}/issue?maxResults=${maxResults}&startAt=${startAt}`;

    if (fields && fields.length > 0) {
      url += `&fields=${fields.join(",")}`;
    }

    return this.auth.request(url);
  }

  /**
   * Remove an issue link
   */
  async removeIssueLink(params: RemoveIssueLinkParams): Promise<void> {
    const { linkId } = params;
    await this.auth.request(`/rest/api/3/issueLink/${linkId}`, {
      method: "DELETE",
    });
  }

  /**
   * Batch create multiple versions
   */
  async batchCreateVersions(params: BatchCreateVersionsParams): Promise<unknown> {
    const { projectKey, versions } = params;

    const results = await Promise.all(
      versions.map((version) =>
        this.createVersion({
          projectKey,
          name: version.name,
          description: version.description,
          releaseDate: version.releaseDate,
          released: version.released,
        })
      )
    );

    return results;
  }
}
