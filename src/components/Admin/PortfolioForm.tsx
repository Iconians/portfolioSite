"use client";

import { useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PortfolioItemSchema,
  type CreatePortfolioInput,
} from "@/lib/types/portfolio";
import {
  createPortfolioAction,
  updatePortfolioAction,
} from "@/lib/actions/portfolio";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PortfolioFormPrimaryFields } from "./portfolio-form/PortfolioFormPrimaryFields";
import { PortfolioFormDetailFields } from "./portfolio-form/PortfolioFormDetailFields";
import { PortfolioFormCategories } from "./portfolio-form/PortfolioFormCategories";
import { PortfolioFormLinks } from "./portfolio-form/PortfolioFormLinks";
import type { PortfolioFormData } from "./portfolio-form/types";

interface PortfolioFormProps {
  initialData?: Partial<CreatePortfolioInput>;
  portfolioId?: string;
  onSuccess?: () => void;
}

export function PortfolioForm({
  initialData,
  portfolioId,
  onSuccess,
}: PortfolioFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(PortfolioItemSchema),
    defaultValues: {
      img: initialData?.img || "",
      caption: initialData?.caption || "",
      description: initialData?.description || "",
      category: (initialData?.category || [""]) as string[],
      url: initialData?.url,
      github: initialData?.github,
      keyFeatures: initialData?.keyFeatures ?? "",
      role: initialData?.role ?? "",
      highlights: initialData?.highlights ?? "",
      projectType: initialData?.projectType ?? "",
    },
  });

  // TypeScript inference issue with zodResolver and useFieldArray - type assertions needed
  const { fields, append, remove } = useFieldArray({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: control as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: "category" as any,
  });

  const onSubmit = (data: PortfolioFormData) => {
    startTransition(async () => {
      const result = portfolioId
        ? await updatePortfolioAction(portfolioId, data)
        : await createPortfolioAction(data);

      if (result.success) {
        toast.success(
          portfolioId
            ? "Portfolio item updated successfully"
            : "Portfolio item created successfully"
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
      <PortfolioFormPrimaryFields
        register={register}
        errors={errors}
        isPending={isPending}
        onImageUpload={(url) => setValue("img", url)}
      />
      <PortfolioFormDetailFields
        register={register}
        errors={errors}
        isPending={isPending}
      />
      <PortfolioFormCategories
        register={register}
        errors={errors}
        fields={fields}
        append={append}
        remove={remove}
        isPending={isPending}
      />
      <PortfolioFormLinks register={register} errors={errors} isPending={isPending} />

      <Button type="submit" disabled={isPending}>
        {isPending
          ? "Saving..."
          : portfolioId
          ? "Update Portfolio Item"
          : "Create Portfolio Item"}
      </Button>
    </form>
  );
}
