"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createPortfolioAction,
  updatePortfolioAction,
} from "@/lib/actions/portfolio";
import {
  mapPortfolioItemToEditorValues,
  splitProjectEditorPayload,
} from "@/lib/portfolio/project-editor";
import {
  ProjectEditorSchema,
  type ProjectEditorFormData,
} from "@/lib/types/portfolio";
import { toast } from "sonner";
import { DetailsSection } from "./sections/DetailsSection";
import { LinksSeoSection } from "./sections/LinksSeoSection";
import { MediaSection } from "./sections/MediaSection";
import { OverviewSection } from "./sections/OverviewSection";
import { StorySection } from "./sections/StorySection";
import { MetricEditor } from "./MetricEditor";
import { ProjectEvolutionEditor } from "./ProjectEvolutionEditor";
import { PlatformShowcaseEditor } from "./PlatformShowcaseEditor";
import type { PortfolioMetric, ProjectVersion } from "@/lib/types/portfolio";

interface ProjectEditorProps {
  initialValues?: ProjectEditorFormData;
  initialOgImageUrl?: string;
  initialMetrics?: PortfolioMetric[];
  initialVersions?: ProjectVersion[];
  portfolioId?: string;
  onSuccess?: () => void;
}

export function ProjectEditor({
  initialValues,
  initialOgImageUrl = "",
  initialMetrics = [],
  initialVersions = [],
  portfolioId,
  onSuccess,
}: ProjectEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [ogImageUrl, setOgImageUrl] = useState(initialOgImageUrl);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectEditorFormData>({
    resolver: zodResolver(ProjectEditorSchema),
    defaultValues: initialValues ?? mapPortfolioItemToEditorValues(),
  });

  const heroImageUrl = useWatch({ control, name: "img" }) ?? "";

  const { fields, append, remove } = useFieldArray({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: control as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: "category" as any,
  });

  const sectionProps = {
    register,
    errors,
    isPending,
    setValue,
    watch,
  };

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
        <TabsList className="flex h-auto w-full flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="story">Story</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="evolution">Evolution</TabsTrigger>
          <TabsTrigger value="platform">Platform</TabsTrigger>
          <TabsTrigger value="links">Links & SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewSection {...sectionProps} />
        </TabsContent>

        <TabsContent value="media">
          <MediaSection
            {...sectionProps}
            heroImageUrl={heroImageUrl}
            onSelectHero={({ id, publicUrl }) => {
              setValue("img", publicUrl, { shouldValidate: true, shouldDirty: true });
              setValue("heroMediaId", id, { shouldDirty: true });
            }}
          />
        </TabsContent>

        <TabsContent value="details">
          <DetailsSection
            {...sectionProps}
            categoryFields={fields}
            appendCategory={append}
            removeCategory={remove}
          />
        </TabsContent>

        <TabsContent value="story">
          <StorySection {...sectionProps} />
        </TabsContent>

        <TabsContent value="metrics">
          <MetricEditor portfolioId={portfolioId} initialMetrics={initialMetrics} />
        </TabsContent>

        <TabsContent value="evolution">
          <ProjectEvolutionEditor
            portfolioId={portfolioId}
            initialVersions={initialVersions}
          />
        </TabsContent>

        <TabsContent value="platform">
          <PlatformShowcaseEditor {...sectionProps} />
        </TabsContent>

        <TabsContent value="links">
          <LinksSeoSection
            {...sectionProps}
            ogImageUrl={ogImageUrl}
            onSelectOg={({ id, publicUrl }) => {
              setValue("ogMediaId", id, { shouldDirty: true });
              setOgImageUrl(publicUrl);
            }}
          />
        </TabsContent>
      </Tabs>

      <Button type="submit" disabled={isPending}>
        {isPending
          ? "Saving..."
          : portfolioId
            ? "Save project"
            : "Create project"}
      </Button>
    </form>
  );
}
