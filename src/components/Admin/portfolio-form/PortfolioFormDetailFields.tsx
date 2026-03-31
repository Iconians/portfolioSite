import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioFormSectionProps } from "./types";

export function PortfolioFormDetailFields({
  register,
  isPending,
}: PortfolioFormSectionProps) {
  return (
    <>
      <div>
        <Label htmlFor="keyFeatures">Key Features</Label>
        <Input
          id="keyFeatures"
          {...register("keyFeatures")}
          disabled={isPending}
          placeholder="Member signups • Event scheduling • Stripe payments"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          One line, separate items with • (bullet)
        </p>
      </div>

      <div>
        <Label htmlFor="highlights">Tech Highlights</Label>
        <Input
          id="highlights"
          {...register("highlights")}
          disabled={isPending}
          placeholder="REST API design • PostgreSQL schema • SSR pages"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          One line, separate items with • (bullet)
        </p>
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Textarea
          id="role"
          {...register("role")}
          disabled={isPending}
          rows={2}
          placeholder="Full-stack development and SaaS architecture (built collaboratively)"
        />
      </div>
    </>
  );
}
