import type {
  PlatformApiMetricCreateRequest,
  PlatformApiMetricUpdateRequest,
  PlatformApiAdminMetric,
} from "./platform-metric-types";
import type {
  PortfolioMetric,
  PortfolioMetricInput,
  PortfolioMetricUpdate,
} from "@/lib/types/portfolio";

function metricTimestamp(): Date {
  return new Date();
}

export function mapPlatformAdminMetricToPortfolio(
  metric: PlatformApiAdminMetric,
  portfolioLocalId: string
): PortfolioMetric {
  const timestamp = metricTimestamp();
  return {
    id: metric.id,
    portfolioId: portfolioLocalId,
    label: metric.label,
    value: metric.value,
    description: metric.description ?? null,
    displayOrder: metric.sort_order,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function mapPlatformAdminMetricsToPortfolio(
  metrics: PlatformApiAdminMetric[] | undefined,
  portfolioLocalId: string
): PortfolioMetric[] {
  return [...(metrics ?? [])]
    .sort((left, right) => {
      const orderDiff = left.sort_order - right.sort_order;
      if (orderDiff !== 0) {
        return orderDiff;
      }
      return left.id.localeCompare(right.id);
    })
    .map((metric) => mapPlatformAdminMetricToPortfolio(metric, portfolioLocalId));
}

export function buildPlatformMetricCreateRequest(
  input: PortfolioMetricInput,
  sortOrder: number
): PlatformApiMetricCreateRequest {
  return {
    label: input.label,
    value: input.value,
    description: input.description?.trim() ? input.description.trim() : null,
    show_on_business: true,
    sort_order: sortOrder,
  };
}

export function buildPlatformMetricUpdateRequest(
  input: PortfolioMetricUpdate
): PlatformApiMetricUpdateRequest {
  const payload: PlatformApiMetricUpdateRequest = {};

  if (input.label !== undefined) {
    payload.label = input.label;
  }
  if (input.value !== undefined) {
    payload.value = input.value;
  }
  if (input.description !== undefined) {
    payload.description = input.description?.trim()
      ? input.description.trim()
      : null;
  }
  if (input.displayOrder !== undefined) {
    payload.sort_order = input.displayOrder;
  }

  return payload;
}
