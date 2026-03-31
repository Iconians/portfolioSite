import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { z } from "zod";
import { PortfolioItemSchema } from "@/lib/types/portfolio";

export type PortfolioFormData = z.infer<typeof PortfolioItemSchema>;

export interface PortfolioFormSectionProps {
  register: UseFormRegister<PortfolioFormData>;
  errors: FieldErrors<PortfolioFormData>;
  isPending: boolean;
}
