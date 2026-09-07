import type { PlatformApiCaseStudyPatchRequest } from "./platform-admin-patch-types";
import type {
  PlatformApiAdminConsumerSettingInput,
  PlatformApiConsumerSetting,
  PlatformApiPresentationScalars,
} from "./platform-presentation-types";
import type { PortfolioExtendedInput } from "@/lib/types/portfolio";

function nullableTextToFormValue(value: string | null | undefined): string {
  return value ?? "";
}

export function mapPlatformPresentationToEditorFields(
  detail: PlatformApiPresentationScalars
): Pick<
  PortfolioExtendedInput,
  | "managePresentation"
  | "devlaunchIsVisible"
  | "devlaunchIsFeatured"
  | "devlaunchSortOrder"
  | "engineeringPortfolioIsVisible"
  | "engineeringPortfolioIsFeatured"
  | "engineeringPortfolioSortOrder"
  | "badge"
  | "bestFor"
  | "businessOutcome"
  | "businessContextNote"
  | "resultsNarrative"
  | "businessSummaryOverride"
  | "businessProblemOverride"
  | "businessSolutionOverride"
  | "engineeringSummaryOverride"
> {
  const presentationDefaults = {
    managePresentation: false,
    devlaunchIsVisible: false,
    devlaunchIsFeatured: false,
    devlaunchSortOrder: 0,
    engineeringPortfolioIsVisible: false,
    engineeringPortfolioIsFeatured: false,
    engineeringPortfolioSortOrder: 0,
    badge: "",
    bestFor: "",
    businessOutcome: "",
    businessContextNote: "",
    resultsNarrative: "",
    businessSummaryOverride: "",
    businessProblemOverride: "",
    businessSolutionOverride: "",
    engineeringSummaryOverride: "",
  };

  if (!detail.consumer_settings?.length) {
    return presentationDefaults;
  }

  const devlaunch = detail.consumer_settings.find(
    (row) => row.consumer === "devlaunch"
  );
  const engineering = detail.consumer_settings.find(
    (row) => row.consumer === "engineering_portfolio"
  );

  return {
    managePresentation: true,
    devlaunchIsVisible: devlaunch?.is_visible ?? false,
    devlaunchIsFeatured: devlaunch?.is_featured ?? false,
    devlaunchSortOrder: devlaunch?.sort_order ?? 0,
    engineeringPortfolioIsVisible: engineering?.is_visible ?? false,
    engineeringPortfolioIsFeatured: engineering?.is_featured ?? false,
    engineeringPortfolioSortOrder: engineering?.sort_order ?? 0,
    badge: nullableTextToFormValue(detail.badge),
    bestFor: nullableTextToFormValue(detail.best_for),
    businessOutcome: nullableTextToFormValue(detail.business_outcome),
    businessContextNote: nullableTextToFormValue(detail.business_context_note),
    resultsNarrative: nullableTextToFormValue(detail.results_narrative),
    businessSummaryOverride: nullableTextToFormValue(detail.business_summary_override),
    businessProblemOverride: nullableTextToFormValue(detail.business_problem_override),
    businessSolutionOverride: nullableTextToFormValue(detail.business_solution_override),
    engineeringSummaryOverride: nullableTextToFormValue(
      detail.engineering_summary_override
    ),
  };
}

export function buildConsumerSettingsFromExtended(
  extended: PortfolioExtendedInput
): PlatformApiAdminConsumerSettingInput[] {
  return [
    {
      consumer: "devlaunch",
      is_visible: extended.devlaunchIsVisible ?? false,
      is_featured: extended.devlaunchIsFeatured ?? false,
      sort_order: extended.devlaunchSortOrder ?? 0,
    },
    {
      consumer: "engineering_portfolio",
      is_visible: extended.engineeringPortfolioIsVisible ?? false,
      is_featured: extended.engineeringPortfolioIsFeatured ?? false,
      sort_order: extended.engineeringPortfolioSortOrder ?? 0,
    },
  ];
}

export function buildConsumerSettingsPatchPreservingPeer(
  current: PlatformApiConsumerSetting[],
  consumer: "devlaunch" | "engineering_portfolio",
  update: Partial<
    Pick<PlatformApiConsumerSetting, "is_visible" | "is_featured" | "sort_order">
  >
): PlatformApiAdminConsumerSettingInput[] {
  const devlaunch =
    current.find((row) => row.consumer === "devlaunch") ?? {
      consumer: "devlaunch",
      is_visible: false,
      is_featured: false,
      sort_order: 0,
    };
  const engineering =
    current.find((row) => row.consumer === "engineering_portfolio") ?? {
      consumer: "engineering_portfolio",
      is_visible: false,
      is_featured: false,
      sort_order: 0,
    };

  if (consumer === "devlaunch") {
    return [
      {
        consumer: "devlaunch",
        is_visible: update.is_visible ?? devlaunch.is_visible,
        is_featured: update.is_featured ?? devlaunch.is_featured,
        sort_order: update.sort_order ?? devlaunch.sort_order,
      },
      {
        consumer: "engineering_portfolio",
        is_visible: engineering.is_visible,
        is_featured: engineering.is_featured,
        sort_order: engineering.sort_order,
      },
    ];
  }

  return [
    {
      consumer: "devlaunch",
      is_visible: devlaunch.is_visible,
      is_featured: devlaunch.is_featured,
      sort_order: devlaunch.sort_order,
    },
    {
      consumer: "engineering_portfolio",
      is_visible: update.is_visible ?? engineering.is_visible,
      is_featured: update.is_featured ?? engineering.is_featured,
      sort_order: update.sort_order ?? engineering.sort_order,
    },
  ];
}

function normalizeNullablePresentationText(
  value: string | null | undefined
): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function buildPresentationPatchFromExtended(
  extended: PortfolioExtendedInput
): Pick<
  PlatformApiCaseStudyPatchRequest,
  | "consumer_settings"
  | "badge"
  | "best_for"
  | "business_outcome"
  | "business_context_note"
  | "results_narrative"
  | "business_summary_override"
  | "business_problem_override"
  | "business_solution_override"
  | "engineering_summary_override"
> {
  if (!extended.managePresentation) {
    return {};
  }

  return {
    consumer_settings: buildConsumerSettingsFromExtended(extended),
    badge: normalizeNullablePresentationText(extended.badge),
    best_for: normalizeNullablePresentationText(extended.bestFor),
    business_outcome: normalizeNullablePresentationText(extended.businessOutcome),
    business_context_note: normalizeNullablePresentationText(
      extended.businessContextNote
    ),
    results_narrative: normalizeNullablePresentationText(extended.resultsNarrative),
    business_summary_override: normalizeNullablePresentationText(
      extended.businessSummaryOverride
    ),
    business_problem_override: normalizeNullablePresentationText(
      extended.businessProblemOverride
    ),
    business_solution_override: normalizeNullablePresentationText(
      extended.businessSolutionOverride
    ),
    engineering_summary_override: normalizeNullablePresentationText(
      extended.engineeringSummaryOverride
    ),
  };
}
