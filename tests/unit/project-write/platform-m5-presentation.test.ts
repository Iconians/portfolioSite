import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { mapPlatformAdminDetailToEditorLoad } from "@/lib/project-write/platform-admin-mapper";
import {
  buildPlatformMetricCreateRequest,
  buildPlatformMetricUpdateRequest,
  mapPlatformAdminMetricToPortfolio,
} from "@/lib/project-write/platform-metric-mapper";
import {
  buildConsumerSettingsFromExtended,
  buildConsumerSettingsPatchPreservingPeer,
  buildPresentationPatchFromExtended,
  mapPlatformPresentationToEditorFields,
} from "@/lib/project-write/platform-presentation-mapper";
import { buildPlatformCaseStudyPatchRequest } from "@/lib/project-write/platform-update-mapper";

import type { PlatformApiAdminCaseStudyDetail } from "@/lib/project-write/platform-admin-types";
import type { PlatformApiConsumerSetting } from "@/lib/project-write/platform-presentation-types";
import type { PortfolioExtendedInput } from "@/lib/types/portfolio";

const PLATFORM_UUID = "00000000-0000-4000-8000-000000000001";
const PORTFOLIO_LOCAL_UUID = "11111111-1111-4111-8111-111111111111";

const consumerSettings: PlatformApiConsumerSetting[] = [
  {
    consumer: "devlaunch",
    is_visible: true,
    is_featured: false,
    sort_order: 2,
  },
  {
    consumer: "engineering_portfolio",
    is_visible: false,
    is_featured: true,
    sort_order: 5,
  },
];

const presentationDetail: PlatformApiAdminCaseStudyDetail = {
  id: PLATFORM_UUID,
  slug: "sample-project",
  title: "Sample",
  summary: "Shared summary",
  project_type: "client",
  lifecycle_status: "active",
  publish_status: "published",
  content_version: 1,
  consumer_settings: consumerSettings,
  badge: "SaaS",
  best_for: "Growing teams",
  business_outcome: "Increased revenue",
  business_context_note: "Enterprise rollout",
  results_narrative: "40% faster delivery",
  business_summary_override: "Business summary",
  business_problem_override: "Business problem",
  business_solution_override: "Business solution",
  engineering_summary_override: "Engineering summary",
};

function presentationExtended(
  overrides: Partial<PortfolioExtendedInput> = {}
): PortfolioExtendedInput {
  return {
    managePresentation: true,
    devlaunchIsVisible: true,
    devlaunchIsFeatured: false,
    devlaunchSortOrder: 2,
    engineeringPortfolioIsVisible: false,
    engineeringPortfolioIsFeatured: true,
    engineeringPortfolioSortOrder: 5,
    badge: "SaaS",
    bestFor: "Growing teams",
    businessOutcome: "Increased revenue",
    businessContextNote: "Enterprise rollout",
    resultsNarrative: "40% faster delivery",
    businessSummaryOverride: "Business summary",
    businessProblemOverride: "Business problem",
    businessSolutionOverride: "Business solution",
    engineeringSummaryOverride: "Engineering summary",
    ...overrides,
  };
}

describe("M5 presentation management", () => {
  test("admin detail includes both consumer rows in load types", () => {
    expect(presentationDetail.consumer_settings?.length).toBe(2);
    expect(presentationDetail.consumer_settings?.map((row) => row.consumer)).toEqual([
      "devlaunch",
      "engineering_portfolio",
    ]);
  });

  test("maps devlaunch consumer settings into editor state", () => {
    const fields = mapPlatformPresentationToEditorFields(presentationDetail);
    expect(fields.devlaunchIsVisible).toBe(true);
    expect(fields.devlaunchIsFeatured).toBe(false);
    expect(fields.devlaunchSortOrder).toBe(2);
  });

  test("maps engineering_portfolio consumer settings into editor state", () => {
    const fields = mapPlatformPresentationToEditorFields(presentationDetail);
    expect(fields.engineeringPortfolioIsVisible).toBe(false);
    expect(fields.engineeringPortfolioIsFeatured).toBe(true);
    expect(fields.engineeringPortfolioSortOrder).toBe(5);
  });

  test("changing DevLaunch is_visible preserves Engineering row exactly", () => {
    const patch = buildConsumerSettingsPatchPreservingPeer(
      consumerSettings,
      "devlaunch",
      { is_visible: false }
    );
    expect(patch[1]).toEqual(consumerSettings[1]);
  });

  test("changing DevLaunch is_featured preserves Engineering row exactly", () => {
    const patch = buildConsumerSettingsPatchPreservingPeer(
      consumerSettings,
      "devlaunch",
      { is_featured: true }
    );
    expect(patch[1]).toEqual(consumerSettings[1]);
  });

  test("changing DevLaunch sort_order preserves Engineering row exactly", () => {
    const patch = buildConsumerSettingsPatchPreservingPeer(
      consumerSettings,
      "devlaunch",
      { sort_order: 99 }
    );
    expect(patch[1]).toEqual(consumerSettings[1]);
  });

  test("changing Engineering is_visible preserves DevLaunch row exactly", () => {
    const patch = buildConsumerSettingsPatchPreservingPeer(
      consumerSettings,
      "engineering_portfolio",
      { is_visible: true }
    );
    expect(patch[0]).toEqual(consumerSettings[0]);
  });

  test("changing Engineering is_featured preserves DevLaunch row exactly", () => {
    const patch = buildConsumerSettingsPatchPreservingPeer(
      consumerSettings,
      "engineering_portfolio",
      { is_featured: false }
    );
    expect(patch[0]).toEqual(consumerSettings[0]);
  });

  test("changing Engineering sort_order preserves DevLaunch row exactly", () => {
    const patch = buildConsumerSettingsPatchPreservingPeer(
      consumerSettings,
      "engineering_portfolio",
      { sort_order: 12 }
    );
    expect(patch[0]).toEqual(consumerSettings[0]);
  });

  test("PATCH sends complete consumer_settings collection", () => {
    const patch = buildPresentationPatchFromExtended(presentationExtended());
    expect(patch.consumer_settings?.length).toBe(2);
    expect(patch.consumer_settings?.map((row) => row.consumer)).toEqual([
      "devlaunch",
      "engineering_portfolio",
    ]);
  });

  test("untouched consumer is not recreated from defaults", () => {
    const patch = buildConsumerSettingsFromExtended(
      presentationExtended({
        devlaunchIsVisible: false,
      })
    );
    expect(patch[1]).toEqual(consumerSettings[1]);
  });

  test("consumer rows are not copied into one another", () => {
    const patch = buildConsumerSettingsFromExtended(
      presentationExtended({
        devlaunchIsFeatured: true,
        engineeringPortfolioIsFeatured: false,
      })
    );
    expect(patch[0].is_featured).toBe(true);
    expect(patch[1].is_featured).toBe(false);
  });

  test("badge loads and saves", () => {
    const fields = mapPlatformPresentationToEditorFields(presentationDetail);
    const patch = buildPresentationPatchFromExtended(presentationExtended());
    expect(fields.badge).toBe("SaaS");
    expect(patch.badge).toBe("SaaS");
  });

  test("best_for loads and saves", () => {
    const fields = mapPlatformPresentationToEditorFields(presentationDetail);
    const patch = buildPresentationPatchFromExtended(presentationExtended());
    expect(fields.bestFor).toBe("Growing teams");
    expect(patch.best_for).toBe("Growing teams");
  });

  test("business_outcome loads and saves", () => {
    const fields = mapPlatformPresentationToEditorFields(presentationDetail);
    const patch = buildPresentationPatchFromExtended(presentationExtended());
    expect(fields.businessOutcome).toBe("Increased revenue");
    expect(patch.business_outcome).toBe("Increased revenue");
  });

  test("business_context_note loads and saves", () => {
    const fields = mapPlatformPresentationToEditorFields(presentationDetail);
    const patch = buildPresentationPatchFromExtended(presentationExtended());
    expect(fields.businessContextNote).toBe("Enterprise rollout");
    expect(patch.business_context_note).toBe("Enterprise rollout");
  });

  test("results_narrative loads and saves", () => {
    const fields = mapPlatformPresentationToEditorFields(presentationDetail);
    const patch = buildPresentationPatchFromExtended(presentationExtended());
    expect(fields.resultsNarrative).toBe("40% faster delivery");
    expect(patch.results_narrative).toBe("40% faster delivery");
  });

  test("business_summary_override loads saves and clears", () => {
    const fields = mapPlatformPresentationToEditorFields(presentationDetail);
    const cleared = buildPresentationPatchFromExtended(
      presentationExtended({ businessSummaryOverride: "" })
    );
    expect(fields.businessSummaryOverride).toBe("Business summary");
    expect(cleared.business_summary_override).toBeNull();
  });

  test("business_problem_override loads saves and clears", () => {
    const cleared = buildPresentationPatchFromExtended(
      presentationExtended({ businessProblemOverride: "   " })
    );
    expect(cleared.business_problem_override).toBeNull();
  });

  test("business_solution_override loads saves and clears", () => {
    const cleared = buildPresentationPatchFromExtended(
      presentationExtended({ businessSolutionOverride: "" })
    );
    expect(cleared.business_solution_override).toBeNull();
  });

  test("business scalars are not written into consumer_settings", () => {
    const patch = buildPresentationPatchFromExtended(presentationExtended());
    for (const row of patch.consumer_settings ?? []) {
      expect("badge" in row).toBe(false);
      expect("business_summary_override" in row).toBe(false);
    }
  });

  test("engineering_summary_override loads", () => {
    const fields = mapPlatformPresentationToEditorFields(presentationDetail);
    expect(fields.engineeringSummaryOverride).toBe("Engineering summary");
  });

  test("engineering_summary_override saves", () => {
    const patch = buildPresentationPatchFromExtended(presentationExtended());
    expect(patch.engineering_summary_override).toBe("Engineering summary");
  });

  test("engineering override can be cleared using null semantics", () => {
    const patch = buildPresentationPatchFromExtended(
      presentationExtended({ engineeringSummaryOverride: "" })
    );
    expect(patch.engineering_summary_override).toBeNull();
  });

  test("show_on_business loads from Platform", () => {
    const metric = mapPlatformAdminMetricToPortfolio(
      {
        id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        label: "Uptime",
        value: "99%",
        description: null,
        show_on_business: false,
        sort_order: 0,
      },
      PORTFOLIO_LOCAL_UUID
    );
    expect(metric.showOnBusiness).toBe(false);
  });

  test("existing metric can toggle show_on_business false", () => {
    expect(
      buildPlatformMetricUpdateRequest({ showOnBusiness: false }).show_on_business
    ).toBe(false);
  });

  test("existing metric can toggle show_on_business true", () => {
    expect(
      buildPlatformMetricUpdateRequest({ showOnBusiness: true }).show_on_business
    ).toBe(true);
  });

  test("metric PATCH uses correct child endpoint fields only", () => {
    const payload = buildPlatformMetricUpdateRequest({
      showOnBusiness: false,
      label: "Latency",
    });
    expect(payload.show_on_business).toBe(false);
    expect(payload.label).toBe("Latency");
    expect("consumer_settings" in payload).toBe(false);
  });

  test("sibling metrics remain unchanged when toggling one metric field", () => {
    const payload = buildPlatformMetricUpdateRequest({ showOnBusiness: false });
    expect(payload.sort_order).toBeUndefined();
    expect(payload.label).toBeUndefined();
  });

  test("metric reorder path remains available after M5", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio-metrics.ts", import.meta.url)
      ),
      "utf8"
    );
    expect(source.includes("reorderPortfolioMetricsViaPlatform")).toBe(true);
  });

  test("new metric create uses operator show_on_business choice", () => {
    expect(
      buildPlatformMetricCreateRequest(
        { label: "Users", value: "10", showOnBusiness: false },
        0
      ).show_on_business
    ).toBe(false);
  });

  test("new metric create defaults show_on_business to true when omitted", () => {
    expect(
      buildPlatformMetricCreateRequest({ label: "Users", value: "10" }, 0)
        .show_on_business
    ).toBe(true);
  });

  test("admin editor load merges presentation fields into initial values", () => {
    const loaded = mapPlatformAdminDetailToEditorLoad({
      detail: presentationDetail,
      media: [],
      portfolioLocalId: PORTFOLIO_LOCAL_UUID,
    });
    expect(loaded.initialValues.managePresentation).toBe(true);
    expect(loaded.initialValues.devlaunchSortOrder).toBe(2);
    expect(loaded.initialValues.engineeringSummaryOverride).toBe(
      "Engineering summary"
    );
  });

  test("admin editor load does not enable presentation PATCH without consumer_settings", () => {
    const loaded = mapPlatformAdminDetailToEditorLoad({
      detail: {
        ...presentationDetail,
        consumer_settings: undefined,
      },
      media: [],
      portfolioLocalId: PORTFOLIO_LOCAL_UUID,
    });
    expect(loaded.initialValues.managePresentation).toBe(false);
  });

  test("platform update mapper includes presentation patch when managePresentation enabled", () => {
    const patch = buildPlatformCaseStudyPatchRequest({
      legacy: {
        img: "https://cdn.example/hero.png",
        caption: "Sample",
        description: "Description",
        category: ["SaaS"],
      },
      extended: presentationExtended(),
      originalSlug: "sample-project",
    });
    expect(patch.consumer_settings?.length).toBe(2);
    expect(patch.badge).toBe("SaaS");
  });

  test("no Prisma presentation write in platform update path", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/project-write/platform-project-update.ts", import.meta.url)
      ),
      "utf8"
    );
    expect(source.includes("buildPlatformCaseStudyPatchRequest")).toBe(true);
    expect(source.includes("consumer_settings")).toBe(false);
    expect(source.includes("db.portfolio")).toBe(false);
  });

  test("no CRM dependency in presentation mapper", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/project-write/platform-presentation-mapper.ts",
          import.meta.url
        )
      ),
      "utf8"
    );
    expect(source.includes("crm")).toBe(false);
    expect(source.includes("devlaunch-crm")).toBe(false);
  });

  test("service credentials remain server-only in admin client", () => {
    const configSource = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/project-write/config.ts", import.meta.url)
      ),
      "utf8"
    );
    const clientSource = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/project-write/platform-api-admin-client.ts",
          import.meta.url
        )
      ),
      "utf8"
    );
    expect(configSource.includes("DEVLAUNCH_PLATFORM_API_TOKEN")).toBe(true);
    expect(clientSource.includes('"use client"')).toBe(false);
  });

  test("M17 write-freeze preserved for platform-api metrics", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio-metrics.ts", import.meta.url)
      ),
      "utf8"
    );
    expect(source.includes("createPortfolioMetricViaPlatform")).toBe(true);
    expect(source.includes("updatePortfolioMetricViaPlatform")).toBe(true);
  });

  test("M2 creation path preserved", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/project-write/platform-project-create.ts",
          import.meta.url
        )
      ),
      "utf8"
    );
    expect(source.includes("createCaseStudy")).toBe(true);
  });

  test("M4 gallery reorder path preserved", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio-media.ts", import.meta.url)
      ),
      "utf8"
    );
    expect(source.includes("reorderProjectGalleryMediaViaPlatform")).toBe(true);
  });

  test("platform-api homepage uses engineering consumer featured state", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/portfolio/home-featured.ts", import.meta.url)
      ),
      "utf8"
    );
    expect(source.includes("pickPlatformEngineeringFeaturedProjects")).toBe(true);
    expect(source.includes('readSource === "platform-api"')).toBe(true);
  });

  test("Presentation UI section exists for platform-api editor", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/components/Admin/portfolio/sections/PresentationSection.tsx",
          import.meta.url
        )
      ),
      "utf8"
    );
    expect(source.includes("DevLaunch public site")).toBe(true);
    expect(source.includes("Engineering Portfolio")).toBe(true);
    expect(source.includes("engineeringSummaryOverride")).toBe(true);
  });
});
