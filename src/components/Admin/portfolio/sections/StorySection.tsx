import { FormField } from "@/components/Admin/shared/FormField";
import { FormSection } from "@/components/Admin/shared/FormSection";
import { StringListEditor } from "@/components/Admin/portfolio/StringListEditor";
import { Textarea } from "@/components/ui/textarea";
import type { ProjectEditorSectionProps } from "./types";

const STORY_FIELDS = [
  {
    name: "problem",
    label: "Problem",
    description: "What problem did this project solve?",
    rows: 4,
  },
  {
    name: "solution",
    label: "Solution",
    description: "How did you approach the solution?",
    rows: 4,
  },
  {
    name: "architecture",
    label: "Architecture",
    description: "Describe the system design and key technical decisions.",
    rows: 5,
  },
  {
    name: "challenges",
    label: "Challenges",
    description: "What were the hardest parts to get right?",
    rows: 4,
  },
  {
    name: "lessonsLearned",
    label: "Lessons learned",
    description: "What would you do differently next time?",
    rows: 4,
  },
  {
    name: "futureImprovements",
    label: "Future improvements",
    description: "What would you add or refine with more time?",
    rows: 4,
  },
] as const;

export function StorySection({
  register,
  errors,
  isPending,
  setValue,
  watch,
}: ProjectEditorSectionProps) {
  const features = watch("features");
  const responsibilities = watch("responsibilities");

  return (
    <FormSection
      title="Engineering story"
      description="Case-study narrative and structured project contributions."
    >
      {STORY_FIELDS.map((field) => (
        <FormField
          key={field.name}
          label={field.label}
          description={field.description}
          error={errors[field.name]?.message}
        >
          <Textarea
            id={field.name}
            {...register(field.name)}
            disabled={isPending}
            rows={field.rows}
          />
        </FormField>
      ))}

      <StringListEditor
        label="Features"
        description="Structured feature list for project detail pages."
        values={features}
        disabled={isPending}
        onChange={(values) =>
          setValue("features", values, { shouldDirty: true, shouldValidate: true })
        }
      />

      <StringListEditor
        label="Responsibilities"
        description="Structured responsibilities for project detail pages."
        values={responsibilities}
        disabled={isPending}
        onChange={(values) =>
          setValue("responsibilities", values, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
      />
    </FormSection>
  );
}
