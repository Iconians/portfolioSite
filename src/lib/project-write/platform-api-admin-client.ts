import {
  getPlatformApiAdminToken,
  getPlatformApiBaseUrl,
} from "./config";
import {
  PlatformApiAdminMalformedResponseError,
} from "./errors";
import * as childClient from "./platform-api-admin-child-client";
import * as mediaClient from "./platform-api-admin-media-client";
import {
  PlatformApiAdminRequestTransport,
  type PlatformApiAdminTransportOptions,
} from "./platform-api-admin-request";

import type { PlatformApiCaseStudyPatchRequest } from "./platform-admin-patch-types";
import type {
  PlatformApiAdminCaseStudyDetail,
  PlatformApiAdminCaseStudyListResponse,
  PlatformApiAdminMediaListResponse,
} from "./platform-admin-types";
import type {
  PlatformAdminMediaRecord,
  PlatformMediaPresignRequest,
  PlatformMediaPresignResponse,
  PlatformMediaRegisterRequest,
  PlatformMediaUpdateRequest,
} from "./platform-media-types";
import type {
  PlatformApiMetricCreateRequest,
  PlatformApiMetricUpdateRequest,
  PlatformApiAdminMetric,
} from "./platform-metric-types";
import type {
  PlatformApiMilestoneCreateRequest,
  PlatformApiMilestoneUpdateRequest,
  PlatformApiAdminMilestone,
} from "./platform-milestone-types";

export type {
  PlatformApiCaseStudyPatchRequest,
  PlatformApiAdminContentItemInput,
  PlatformApiAdminTechnologyInput,
  PlatformApiAdminCategoryInput,
  PlatformApiAdminLinkInput,
} from "./platform-admin-patch-types";
export type {
  PlatformApiAdminCaseStudyDetail,
  PlatformApiAdminCaseStudyListItem,
  PlatformApiAdminCaseStudyListResponse,
  PlatformApiAdminMediaListItem,
  PlatformApiAdminMediaListResponse,
} from "./platform-admin-types";

export type PlatformApiAdminClientOptions = PlatformApiAdminTransportOptions;

/** Authenticated Platform API admin client for Phase 11 write integration. */
export class PlatformApiAdminClient extends PlatformApiAdminRequestTransport {
  constructor(options: PlatformApiAdminClientOptions) {
    super(options);
  }

  static fromEnvironment(fetchImpl?: typeof fetch): PlatformApiAdminClient | null {
    const baseUrl = getPlatformApiBaseUrl();
    const token = getPlatformApiAdminToken();
    if (!baseUrl || !token) {
      return null;
    }

    return new PlatformApiAdminClient({ baseUrl, token, fetchImpl });
  }

  async listCaseStudies(options?: {
    page?: number;
    limit?: number;
  }): Promise<PlatformApiAdminCaseStudyListResponse> {
    const params = new URLSearchParams();
    if (options?.page !== undefined) {
      params.set("page", String(options.page));
    }
    if (options?.limit !== undefined) {
      params.set("limit", String(options.limit));
    }

    const query = params.toString();
    const path = query ? `/case-studies?${query}` : "/case-studies";
    const data = await this.requestJson<PlatformApiAdminCaseStudyListResponse>(path, {
      operation: "listCaseStudies",
    });

    if (!data || !Array.isArray(data.items)) {
      throw new PlatformApiAdminMalformedResponseError(
        "Platform API admin list response missing items array"
      );
    }

    return data;
  }

  async getCaseStudyById(
    id: string
  ): Promise<PlatformApiAdminCaseStudyDetail> {
    const data = await this.requestJson<PlatformApiAdminCaseStudyDetail>(
      `/case-studies/${encodeURIComponent(id)}`,
      { operation: "getCaseStudyById" }
    );

    if (!data?.id) {
      throw new PlatformApiAdminMalformedResponseError(
        "Platform API admin detail response missing id"
      );
    }

    return data;
  }

  async updateCaseStudy(
    id: string,
    payload: PlatformApiCaseStudyPatchRequest
  ): Promise<PlatformApiAdminCaseStudyDetail> {
    const data = await this.requestJson<PlatformApiAdminCaseStudyDetail>(
      `/case-studies/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: payload,
        operation: "updateCaseStudy",
      }
    );

    if (!data?.id) {
      throw new PlatformApiAdminMalformedResponseError(
        "Platform API admin patch response missing id"
      );
    }

    return data;
  }

  async createMetric(
    caseStudyId: string,
    payload: PlatformApiMetricCreateRequest
  ): Promise<PlatformApiAdminMetric> {
    return childClient.createMetric(this, caseStudyId, payload);
  }

  async updateMetric(
    metricId: string,
    payload: PlatformApiMetricUpdateRequest
  ): Promise<PlatformApiAdminMetric> {
    return childClient.updateMetric(this, metricId, payload);
  }

  async deleteMetric(metricId: string): Promise<void> {
    return childClient.deleteMetric(this, metricId);
  }

  async createMilestone(
    caseStudyId: string,
    payload: PlatformApiMilestoneCreateRequest
  ): Promise<PlatformApiAdminMilestone> {
    return childClient.createMilestone(this, caseStudyId, payload);
  }

  async updateMilestone(
    milestoneId: string,
    payload: PlatformApiMilestoneUpdateRequest
  ): Promise<PlatformApiAdminMilestone> {
    return childClient.updateMilestone(this, milestoneId, payload);
  }

  async deleteMilestone(milestoneId: string): Promise<void> {
    return childClient.deleteMilestone(this, milestoneId);
  }

  async publishCaseStudy(id: string): Promise<PlatformApiAdminCaseStudyDetail> {
    const data = await this.requestJson<PlatformApiAdminCaseStudyDetail>(
      `/case-studies/${encodeURIComponent(id)}/publish`,
      { method: "POST", operation: "publishCaseStudy" }
    );

    if (!data?.id) {
      throw new PlatformApiAdminMalformedResponseError(
        "Platform API admin publish response missing id"
      );
    }

    return data;
  }

  async unpublishCaseStudy(id: string): Promise<PlatformApiAdminCaseStudyDetail> {
    const data = await this.requestJson<PlatformApiAdminCaseStudyDetail>(
      `/case-studies/${encodeURIComponent(id)}/unpublish`,
      { method: "POST", operation: "unpublishCaseStudy" }
    );

    if (!data?.id) {
      throw new PlatformApiAdminMalformedResponseError(
        "Platform API admin unpublish response missing id"
      );
    }

    return data;
  }

  async archiveCaseStudy(id: string): Promise<PlatformApiAdminCaseStudyDetail> {
    const data = await this.requestJson<PlatformApiAdminCaseStudyDetail>(
      `/case-studies/${encodeURIComponent(id)}/archive`,
      { method: "POST", operation: "archiveCaseStudy" }
    );

    if (!data?.id) {
      throw new PlatformApiAdminMalformedResponseError(
        "Platform API admin archive response missing id"
      );
    }

    return data;
  }

  async presignCaseStudyMedia(
    caseStudyId: string,
    payload: PlatformMediaPresignRequest
  ): Promise<PlatformMediaPresignResponse> {
    return mediaClient.presignCaseStudyMedia(this, caseStudyId, payload);
  }

  async registerCaseStudyMedia(
    caseStudyId: string,
    payload: PlatformMediaRegisterRequest
  ): Promise<PlatformAdminMediaRecord> {
    return mediaClient.registerCaseStudyMedia(this, caseStudyId, payload);
  }

  async updateCaseStudyMedia(
    mediaId: string,
    payload: PlatformMediaUpdateRequest
  ): Promise<PlatformAdminMediaRecord> {
    return mediaClient.updateCaseStudyMedia(this, mediaId, payload);
  }

  async deleteCaseStudyMedia(mediaId: string): Promise<void> {
    return mediaClient.deleteCaseStudyMedia(this, mediaId);
  }

  async listMedia(options?: {
    caseStudyId?: string;
    role?: string;
    uploadStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<PlatformApiAdminMediaListResponse> {
    const params = new URLSearchParams();
    if (options?.caseStudyId) {
      params.set("case_study_id", options.caseStudyId);
    }
    if (options?.role) {
      params.set("role", options.role);
    }
    if (options?.uploadStatus) {
      params.set("upload_status", options.uploadStatus);
    }
    if (options?.page !== undefined) {
      params.set("page", String(options.page));
    }
    if (options?.limit !== undefined) {
      params.set("limit", String(options.limit));
    }

    const query = params.toString();
    const path = query ? `/media?${query}` : "/media";
    const data = await this.requestJson<PlatformApiAdminMediaListResponse>(path, {
      operation: "listMedia",
    });

    if (!data || !Array.isArray(data.items)) {
      throw new PlatformApiAdminMalformedResponseError(
        "Platform API admin media list response missing items array"
      );
    }

    return data;
  }
}
