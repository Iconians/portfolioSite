import { PlatformApiAdminMalformedResponseError } from "./errors";

import type { PlatformApiAdminRequestTransport } from "./platform-api-admin-request";
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

type ChildTransport = Pick<PlatformApiAdminRequestTransport, "requestJson">;

export async function createMetric(
  transport: ChildTransport,
  caseStudyId: string,
  payload: PlatformApiMetricCreateRequest
): Promise<PlatformApiAdminMetric> {
  const data = await transport.requestJson<PlatformApiAdminMetric>(
    `/case-studies/${encodeURIComponent(caseStudyId)}/metrics`,
    {
      method: "POST",
      body: payload,
      operation: "createMetric",
    }
  );

  if (!data?.id) {
    throw new PlatformApiAdminMalformedResponseError(
      "Platform API admin metric create response missing id"
    );
  }

  return data;
}

export async function updateMetric(
  transport: ChildTransport,
  metricId: string,
  payload: PlatformApiMetricUpdateRequest
): Promise<PlatformApiAdminMetric> {
  const data = await transport.requestJson<PlatformApiAdminMetric>(
    `/metrics/${encodeURIComponent(metricId)}`,
    {
      method: "PATCH",
      body: payload,
      operation: "updateMetric",
    }
  );

  if (!data?.id) {
    throw new PlatformApiAdminMalformedResponseError(
      "Platform API admin metric update response missing id"
    );
  }

  return data;
}

export async function deleteMetric(
  transport: ChildTransport,
  metricId: string
): Promise<void> {
  await transport.requestJson(`/metrics/${encodeURIComponent(metricId)}`, {
    method: "DELETE",
    operation: "deleteMetric",
  });
}

export async function createMilestone(
  transport: ChildTransport,
  caseStudyId: string,
  payload: PlatformApiMilestoneCreateRequest
): Promise<PlatformApiAdminMilestone> {
  const data = await transport.requestJson<PlatformApiAdminMilestone>(
    `/case-studies/${encodeURIComponent(caseStudyId)}/milestones`,
    {
      method: "POST",
      body: payload,
      operation: "createMilestone",
    }
  );

  if (!data?.id) {
    throw new PlatformApiAdminMalformedResponseError(
      "Platform API admin milestone create response missing id"
    );
  }

  return data;
}

export async function updateMilestone(
  transport: ChildTransport,
  milestoneId: string,
  payload: PlatformApiMilestoneUpdateRequest
): Promise<PlatformApiAdminMilestone> {
  const data = await transport.requestJson<PlatformApiAdminMilestone>(
    `/milestones/${encodeURIComponent(milestoneId)}`,
    {
      method: "PATCH",
      body: payload,
      operation: "updateMilestone",
    }
  );

  if (!data?.id) {
    throw new PlatformApiAdminMalformedResponseError(
      "Platform API admin milestone update response missing id"
    );
  }

  return data;
}

export async function deleteMilestone(
  transport: ChildTransport,
  milestoneId: string
): Promise<void> {
  await transport.requestJson(`/milestones/${encodeURIComponent(milestoneId)}`, {
    method: "DELETE",
    operation: "deleteMilestone",
  });
}
