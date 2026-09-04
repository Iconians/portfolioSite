"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useFieldArray, useForm, useWatch, type FieldArrayPath } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  createPortfolioAction,
  updatePortfolioAction,
} from "@/lib/actions/portfolio";
import {
  mapPortfolioItemToEditorValues,
  splitProjectEditorPayload,
} from "@/lib/portfolio/project-editor";
import { shouldDisableChildReorder } from "@/lib/project-write/platform-child-reorder-policy";
import {
  ProjectEditorSchema,
  type PortfolioMetric,
  type ProjectEditorFormData,
  type ProjectVersion,
} from "@/lib/types/portfolio";

import { MetricEditor } from "./MetricEditor";
import { PlatformShowcaseEditor } from "./PlatformShowcaseEditor";
import { ProjectEditorTabList } from "./ProjectEditorTabList";
import { ProjectEvolutionEditor } from "./ProjectEvolutionEditor";
import { DetailsSection } from "./sections/DetailsSection";
import { LinksSeoSection } from "./sections/LinksSeoSection";
import { MediaSection } from "./sections/MediaSection";
import { OverviewSection } from "./sections/OverviewSection";
import { StorySection } from "./sections/StorySection";

import type { PlatformLifecycleAdminState } from "@/lib/project-write/platform-lifecycle-policy";


interface ProjectEditorProps {
  initialValues?: ProjectEditorFormData;
  initialOgImageUrl?: string;
  initialMetrics?: PortfolioMetric[];
  initialVersions?: ProjectVersion[];
  portfolioId?: string;
  writeSource?: "database" | "platform-api";
  platformLifecycleState?: PlatformLifecycleAdminState;
  onSuccess?: () => void;
}

function projectSubmitLabel(isPending: boolean, portfolioId?: string): string {
  if (isPending) {
    return "Saving...";
  }
  if (portfolioId) {
    return "Save project";
  }
  return "Create project";
}

export function ProjectEditor({
  initialValues,
  initialOgImageUrl = "",
  initialMetrics = [],
  initialVersions = [],
  portfolioId,
  writeSource = "database",
  platformLifecycleState,
  onSuccess,
}: ProjectEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [ogImageUrl, setOgImageUrl] = useState(initialOgImageUrl);
  const disableChildReorder = shouldDisableChildReorder(writeSource);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProjectEditorFormData>({
    resolver: zodResolver(ProjectEditorSchema),
    defaultValues: initialValues ?? mapPortfolioItemToEditorValues(),
  });

  const heroImageUrl = useWatch({ control, name: "img" }) ?? "";

  const {
    fields: categoryFields,
    append,
    remove: removeCategory,
  } = useFieldArray({
    control,
    name: "category" as FieldArrayPath<ProjectEditorFormData>,
  });

  const appendCategory = (value: string): void => {
    append(value as never);
  };

  const sectionProps = {
    register,
    errors,
    isPending,
    setValue,
    watch,
  };

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const onSubmit = (data: ProjectEditorFormData) => {
    startTransition(async () => {
      const { legacy, extended } = splitProjectEditorPayload(data);
      const result = portfolioId
        ? await updatePortfolioAction(portfolioId, legacy, extended)
        : await createPortfolioAction(legacy, extended);

      if (result.success) {
        toast.success(
          portfolioId ? "Project updated successfully" : "Project created successfully"
        );
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/admin/portfolio");
          router.refresh();
        }
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="overview">
        <ProjectEditorTabList />

        <TabsContent value="overview">
          <OverviewSection
            {...sectionProps}
            slugReadOnly={writeSource === "platform-api" && Boolean(portfolioId)}
            writeSource={writeSource}
            portfolioId={portfolioId}
            platformLifecycleState={platformLifecycleState}
            projectTitle={initialValues?.caption ?? "this project"}
          />
        </TabsContent>

        <TabsContent value="media">
          <MediaSection
            {...sectionProps}
            heroImageUrl={heroImageUrl}
            writeSource={writeSource}
            portfolioId={portfolioId}
            onSelectHero={({ id, publicUrl }) => {
              setValue("img", publicUrl, { shouldValidate: true, shouldDirty: true });
              setValue("heroMediaId", id, { shouldDirty: true });
            }}
          />
        </TabsContent>

        <TabsContent value="details">
          <DetailsSection
            {...sectionProps}
            categoryFields={categoryFields}
            appendCategory={appendCategory}
            removeCategory={removeCategory}
          />
        </TabsContent>

        <TabsContent value="story">
          <StorySection {...sectionProps} />
        </TabsContent>

        <TabsContent value="metrics">
          <MetricEditor
            portfolioId={portfolioId}
            initialMetrics={initialMetrics}
            disableReorder={disableChildReorder}
          />
        </TabsContent>

        <TabsContent value="evolution">
          <ProjectEvolutionEditor
            portfolioId={portfolioId}
            initialVersions={initialVersions}
            disableReorder={disableChildReorder}
          />
        </TabsContent>

        <TabsContent value="platform">
          <PlatformShowcaseEditor {...sectionProps} />
        </TabsContent>

        <TabsContent value="links">
          <LinksSeoSection
            {...sectionProps}
            ogImageUrl={ogImageUrl}
            writeSource={writeSource}
            portfolioId={portfolioId}
            onSelectOg={({ id, publicUrl }) => {
              setValue("ogMediaId", id, { shouldDirty: true });
              setOgImageUrl(publicUrl);
            }}
          />
        </TabsContent>
      </Tabs>

      <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-5">
          {isDirty ? (
            <p className="text-sm text-amber-600 dark:text-amber-400">Unsaved changes</p>
          ) : null}
        </div>
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {projectSubmitLabel(isPending, portfolioId)}
        </Button>
      </div>
    </form>
  );
}
