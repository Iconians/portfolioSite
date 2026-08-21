import type { ProjectEditorFormData } from "@/lib/types/portfolio";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

export interface ProjectEditorSectionProps {
  register: UseFormRegister<ProjectEditorFormData>;
  errors: FieldErrors<ProjectEditorFormData>;
  isPending: boolean;
  setValue: UseFormSetValue<ProjectEditorFormData>;
  watch: UseFormWatch<ProjectEditorFormData>;
}
