/**
 * Confluence API client
 */

import type { AtlassianAuth } from "../common/auth.js";

export interface ListSpacesParams {
  limit?: number;
  start?: number;
}

export interface ListPagesParams {
  spaceId: string;
  limit?: number;
  cursor?: string;
  status?: "current" | "archived" | "trashed";
}

export interface CreatePageParams {
  spaceId: string;
  title: string;
  body: string;
  parentId?: string;
}

export interface UpdatePageParams {
  pageId: string;
  title: string;
  body: string;
  version: number;
}

export interface SearchParams {
  cql: string;
  limit?: number;
  start?: number;
  expand?: string;
}

export interface GetPageParams {
  pageId: string;
  bodyFormat?: string;
}

export interface GetPageChildrenParams {
  pageId: string;
  limit?: number;
  cursor?: string;
  sort?: string;
}

export interface GetCommentsParams {
  pageId: string;
  bodyFormat?: string;
  limit?: number;
  cursor?: string;
}

export interface GetLabelsParams {
  pageId: string;
  prefix?: string;
  limit?: number;
  cursor?: string;
  sort?: string;
}

export interface SearchUserParams {
  cql: string;
  limit?: number;
  start?: number;
}

export interface DeletePageParams {
  pageId: string;
  purge?: boolean;
}

export interface AddLabelParams {
  pageId: string;
  labels: Array<{ prefix: string; name: string }>;
}

export interface AddCommentParams {
  pageId: string;
  body: string;
  parentCommentId?: string;
}

export class ConfluenceAPI {
  constructor(private readonly auth: AtlassianAuth) {}

  /**
   * List all Confluence spaces
   */
  async listSpaces(params: ListSpacesParams = {}): Promise<unknown> {
    const limit = params.limit || 25;
    const start = params.start || 0;
    return this.auth.request(`/wiki/rest/api/space?limit=${limit}&start=${start}`);
  }

  /**
   * List pages in a Confluence space
   */
  async listPages(params: ListPagesParams): Promise<unknown> {
    const { spaceId, limit = 50, cursor, status = "current" } = params;
    let url = `/wiki/api/v2/pages?spaceId=${spaceId}&limit=${limit}&status=${status}`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    return this.auth.request(url);
  }

  /**
   * Create a new page in Confluence
   */
  async createPage(params: CreatePageParams): Promise<unknown> {
    const { spaceId, title, body, parentId } = params;

    const payload: {
      spaceId: string;
      status: string;
      title: string;
      body: { representation: string; value: string };
      parentId?: string;
    } = {
      spaceId,
      status: "current",
      title,
      body: {
        representation: "storage",
        value: body,
      },
    };

    if (parentId) {
      payload.parentId = parentId;
    }

    return this.auth.request("/wiki/api/v2/pages", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Update an existing Confluence page
   */
  async updatePage(params: UpdatePageParams): Promise<unknown> {
    const { pageId, title, body, version } = params;

    const payload = {
      id: pageId,
      status: "current",
      title,
      body: {
        representation: "storage",
        value: body,
      },
      version: {
        number: version + 1,
      },
    };

    return this.auth.request(`/wiki/api/v2/pages/${pageId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Search Confluence content using CQL (v1 API)
   */
  async search(params: SearchParams): Promise<unknown> {
    const { cql, limit = 25, start = 0, expand } = params;
    let url = `/wiki/rest/api/search?cql=${encodeURIComponent(cql)}&limit=${limit}&start=${start}`;
    if (expand) {
      url += `&expand=${expand}`;
    }
    return this.auth.request(url);
  }

  /**
   * Get a single page with specified body format (v2 API)
   */
  async getPage(params: GetPageParams): Promise<unknown> {
    const { pageId, bodyFormat = "storage" } = params;
    return this.auth.request(`/wiki/api/v2/pages/${pageId}?body-format=${bodyFormat}`);
  }

  /**
   * Get child pages of a page (v2 API)
   */
  async getPageChildren(params: GetPageChildrenParams): Promise<unknown> {
    const { pageId, limit = 25, cursor, sort } = params;
    let url = `/wiki/api/v2/pages/${pageId}/children?limit=${limit}`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    if (sort) {
      url += `&sort=${sort}`;
    }
    return this.auth.request(url);
  }

  /**
   * Get comments on a page (v2 API)
   */
  async getComments(params: GetCommentsParams): Promise<unknown> {
    const { pageId, bodyFormat = "storage", limit = 25, cursor } = params;
    let url = `/wiki/api/v2/pages/${pageId}/footer-comments?body-format=${bodyFormat}&limit=${limit}`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    return this.auth.request(url);
  }

  /**
   * Get labels on a page (v2 API)
   */
  async getLabels(params: GetLabelsParams): Promise<unknown> {
    const { pageId, prefix, limit = 25, cursor, sort } = params;
    let url = `/wiki/api/v2/pages/${pageId}/labels?limit=${limit}`;
    if (prefix) {
      url += `&prefix=${prefix}`;
    }
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    if (sort) {
      url += `&sort=${sort}`;
    }
    return this.auth.request(url);
  }

  /**
   * Search for users using CQL (v1 API)
   */
  async searchUser(params: SearchUserParams): Promise<unknown> {
    const { cql, limit = 25, start = 0 } = params;
    return this.auth.request(
      `/wiki/rest/api/search/user?cql=${encodeURIComponent(cql)}&limit=${limit}&start=${start}`
    );
  }

  /**
   * Delete a page (v2 API)
   */
  async deletePage(params: DeletePageParams): Promise<void> {
    const { pageId, purge = false } = params;
    const url = purge ? `/wiki/api/v2/pages/${pageId}?purge=true` : `/wiki/api/v2/pages/${pageId}`;
    await this.auth.request(url, {
      method: "DELETE",
    });
  }

  /**
   * Add labels to a page (v1 API)
   */
  async addLabel(params: AddLabelParams): Promise<unknown> {
    const { pageId, labels } = params;
    return this.auth.request(`/wiki/rest/api/content/${pageId}/label`, {
      method: "POST",
      body: JSON.stringify(labels),
    });
  }

  /**
   * Add a comment to a page (v2 API)
   */
  async addComment(params: AddCommentParams): Promise<unknown> {
    const { pageId, body, parentCommentId } = params;

    // When replying to a comment, only parentCommentId should be specified
    // When creating a top-level comment, only pageId should be specified
    const payload: {
      pageId?: string;
      body: { representation: string; value: string };
      parentCommentId?: string;
    } = {
      body: {
        representation: "storage",
        value: body,
      },
    };

    if (parentCommentId) {
      payload.parentCommentId = parentCommentId;
    } else {
      payload.pageId = pageId;
    }

    return this.auth.request("/wiki/api/v2/footer-comments", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}
