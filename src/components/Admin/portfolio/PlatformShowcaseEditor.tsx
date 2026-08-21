"use client";

import { useState } from "react";

import { FormField } from "@/components/Admin/shared/FormField";
import { FormSection } from "@/components/Admin/shared/FormSection";
import { PlatformShowcase } from "@/components/Portfolio/PlatformShowcase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizePlatformFeatures } from "@/lib/portfolio/platform";
import {
  PLATFORM_FEATURE_CATALOG,
  partitionPlatformFeatures,
} from "@/lib/portfolio/platform-feature-catalog";

import type { ProjectEditorSectionProps } from "./sections/types";

export function PlatformShowcaseEditor({
  isPending,
  setValue,
  watch,
}: ProjectEditorSectionProps) {
  const showPlatformSection = watch("showPlatformSection");
  const platformFeatures = watch("platformFeatures");
  const [customFeature, setCustomFeature] = useState("");

  const { catalogSelections, customFeatures } =
    partitionPlatformFeatures(platformFeatures);

  function updateFeatures(nextFeatures: string[]) {
    setValue("platformFeatures", normalizePlatformFeatures(nextFeatures), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function toggleCatalogFeature(feature: string, checked: boolean) {
    if (checked) {
      updateFeatures([...platformFeatures, feature]);
      return;
    }

    updateFeatures(
      platformFeatures.filter(
        (entry) => entry.trim().toLowerCase() !== feature.toLowerCase()
      )
    );
  }

  function addCustomFeature() {
    const trimmed = customFeature.trim();
    if (!trimmed) {
      return;
    }

    updateFeatures([...platformFeatures, trimmed]);
    setCustomFeature("");
  }

  function removeCustomFeature(feature: string) {
    updateFeatures(
      platformFeatures.filter(
        (entry) => entry.trim().toLowerCase() !== feature.toLowerCase()
      )
    );
  }

  const previewFeatures = showPlatformSection
    ? normalizePlatformFeatures(platformFeatures)
    : [];

  return (
    <div className="space-y-6">
      <FormSection
        title="Platform showcase"
        description='Optional "Built with this platform" section for meta or platform demonstration projects.'
      >
        <div className="flex items-center gap-3">
          <input
            id="showPlatformSection"
            type="checkbox"
            checked={showPlatformSection}
            disabled={isPending}
            className="h-4 w-4 rounded border border-input"
            onChange={(event) =>
              setValue("showPlatformSection", event.target.checked, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
          <Label htmlFor="showPlatformSection" className="font-normal">
            Show platform showcase on the public project page
          </Label>
        </div>

        {showPlatformSection ? (
          <>
            <FormField label="Catalog features">
              <div className="grid gap-2 sm:grid-cols-2">
                {PLATFORM_FEATURE_CATALOG.map((feature) => {
                  const checked = catalogSelections.some(
                    (entry) => entry.toLowerCase() === feature.toLowerCase()
                  );

                  return (
                    <label
                      key={feature}
                      className="flex items-start gap-2 rounded-md border p-3 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={isPending}
                        className="mt-0.5 h-4 w-4 rounded border border-input"
                        onChange={(event) =>
                          toggleCatalogFeature(feature, event.target.checked)
                        }
                      />
                      <span>{feature}</span>
                    </label>
                  );
                })}
              </div>
            </FormField>

            <FormField label="Custom feature">
              <div className="flex gap-2">
                <Input
                  value={customFeature}
                  disabled={isPending}
                  placeholder="Add a custom platform capability"
                  onChange={(event) => setCustomFeature(event.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending || !customFeature.trim()}
                  onClick={addCustomFeature}
                >
                  Add
                </Button>
              </div>
            </FormField>

            {customFeatures.length > 0 ? (
              <FormField label="Custom selections">
                <ul className="space-y-2">
                  {customFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                    >
                      <span>{feature}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => removeCustomFeature(feature)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </FormField>
            ) : null}

            {previewFeatures.length === 0 ? (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Select at least one feature before saving with the showcase enabled.
              </p>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Disabled by default. Feature selections are kept but ignored while off.
          </p>
        )}
      </FormSection>

      {showPlatformSection && previewFeatures.length > 0 ? (
        <FormSection
          title="Showcase preview"
          description="Preview of the checklist shown on the public project page."
        >
          <PlatformShowcase features={previewFeatures} />
        </FormSection>
      ) : null}
    </div>
  );
}
