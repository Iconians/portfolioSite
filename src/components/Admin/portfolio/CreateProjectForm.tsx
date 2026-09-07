"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "@/components/Admin/shared/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPortfolioProjectAction } from "@/lib/actions/portfolio";
import {
  CreatePortfolioProjectInputSchema,
  type CreatePortfolioProjectInput,
} from "@/lib/project-write/create-portfolio-project-input";
import { PROJECT_TYPE_ORDER } from "@/lib/types/portfolio";

const PROJECT_TYPE_LABELS: Record<(typeof PROJECT_TYPE_ORDER)[number], string> = {
  saas: "SaaS",
  client: "Client",
  engineering: "Engineering",
  personal: "Personal",
};

export function CreateProjectForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePortfolioProjectInput>({
    resolver: zodResolver(CreatePortfolioProjectInputSchema),
    defaultValues: {
      title: "",
      projectType: "client",
      slug: "",
    },
  });

  const onSubmit = (data: CreatePortfolioProjectInput) => {
    startTransition(async () => {
      const result = await createPortfolioProjectAction(data);

      if (result.success) {
        toast.success("Project created");
        router.push(`/admin/portfolio/${result.data.portfolioLocalId}`);
        router.refresh();
        return;
      }

      toast.error(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
      <FormField label="Title" htmlFor="title" error={errors.title?.message}>
        <Input id="title" {...register("title")} disabled={isPending} />
      </FormField>

      <FormField
        label="Project type"
        htmlFor="projectType"
        error={errors.projectType?.message}
        description="Required by Platform API."
      >
        <select
          id="projectType"
          {...register("projectType")}
          disabled={isPending}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {PROJECT_TYPE_ORDER.map((type) => (
            <option key={type} value={type}>
              {PROJECT_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Slug (optional)"
        htmlFor="slug"
        error={errors.slug?.message}
        description="Leave blank to let Platform generate a slug from the title."
      >
        <Input
          id="slug"
          {...register("slug")}
          disabled={isPending}
          placeholder="my-new-project"
        />
      </FormField>

      <p className="text-sm text-muted-foreground">
        New projects start as Platform drafts and remain hidden from public sites until
        you publish and enable consumer visibility in the editor.
      </p>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create project"}
        </Button>
        <Button type="button" variant="outline" asChild disabled={isPending}>
          <Link href="/admin/portfolio">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
