/** Platform admin consumer_settings (M5 presentation management). */

export type PlatformConsumerName = "devlaunch" | "engineering_portfolio";

export interface PlatformApiConsumerSetting {
  consumer: PlatformConsumerName;
  is_visible: boolean;
  is_featured: boolean;
  sort_order: number;
}

export interface PlatformApiAdminConsumerSettingInput {
  consumer: PlatformConsumerName;
  is_visible: boolean;
  is_featured: boolean;
  sort_order: number;
}

/** Case-study presentation scalars on admin detail / PATCH (not consumer_settings). */
export interface PlatformApiPresentationScalars {
  badge?: string | null;
  best_for?: string | null;
  business_outcome?: string | null;
  business_context_note?: string | null;
  results_narrative?: string | null;
  business_summary_override?: string | null;
  business_problem_override?: string | null;
  business_solution_override?: string | null;
  engineering_summary_override?: string | null;
  consumer_settings?: PlatformApiConsumerSetting[];
}
