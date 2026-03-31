import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PortfolioFormSectionProps } from "./types";

export function PortfolioFormLinks({
  register,
  errors,
  isPending,
}: PortfolioFormSectionProps) {
  return (
    <>
      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          {...register("url")}
          disabled={isPending}
          placeholder="https://example.com or #"
        />
        {errors.url && <p className="mt-1 text-sm text-red-500">{errors.url.message}</p>}
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
          <p className="mt-1 text-sm text-red-500">{errors.github.message}</p>
        )}
      </div>
    </>
  );
}
