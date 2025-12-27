"use client";

import { useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PortfolioItemSchema,
  type CreatePortfolioInput,
} from "@/lib/types/portfolio";
import type { z } from "zod";
import {
  createPortfolioAction,
  updatePortfolioAction,
} from "@/lib/actions/portfolio";
import { Button } from "@/app/Components/ui/button";
import { Input } from "@/app/Components/ui/input";
import { Textarea } from "@/app/Components/ui/textarea";
import { Label } from "@/app/Components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./ImageUpload";

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

  type FormData = z.infer<typeof PortfolioItemSchema>;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PortfolioItemSchema),
    defaultValues: {
      img: initialData?.img || "",
      caption: initialData?.caption || "",
      description: initialData?.description || "",
      category: (initialData?.category || [""]) as string[],
      url: initialData?.url,
      github: initialData?.github,
    },
  });

  // TypeScript inference issue with zodResolver and useFieldArray - type assertions needed
  const { fields, append, remove } = useFieldArray({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: control as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: "category" as any,
  });

  const onSubmit = (data: FormData) => {
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
      <div>
        <Label htmlFor="img">Image Path</Label>
        <div className="flex gap-2 mt-2">
          <Input
            id="img"
            {...register("img")}
            disabled={isPending}
            placeholder="/image.png"
            className="flex-1"
          />
          <ImageUpload
            onUpload={(url) => {
              setValue("img", url);
            }}
          />
        </div>
        {errors.img && (
          <p className="text-sm text-red-500 mt-1">{errors.img.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="caption">Caption</Label>
        <Input id="caption" {...register("caption")} disabled={isPending} />
        {errors.caption && (
          <p className="text-sm text-red-500 mt-1">{errors.caption.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          disabled={isPending}
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <Label>Categories</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mt-2">
            <Input {...register(`category.${index}`)} disabled={isPending} />
            <Button
              type="button"
              variant="outline"
              onClick={() => remove(index)}
              disabled={isPending || fields.length === 1}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => append("")}
          disabled={isPending}
          className="mt-2"
        >
          Add Category
        </Button>
        {errors.category && (
          <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          {...register("url")}
          disabled={isPending}
          placeholder="https://example.com or #"
        />
        {errors.url && (
          <p className="text-sm text-red-500 mt-1">{errors.url.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="github">GitHub URL</Label>
        <Input
          id="github"
          {...register("github")}
          disabled={isPending}
          placeholder="https://github.com/user/repo or #"
        />
        {errors.github && (
          <p className="text-sm text-red-500 mt-1">{errors.github.message}</p>
        )}
      </div>

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
