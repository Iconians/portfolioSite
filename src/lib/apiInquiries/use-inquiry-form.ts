"use client";

import { useState } from "react";

import { submitInquiry } from "./inquires";
import {
  buildInquiryInputFromForm,
  getInquiryFeedbackMessage,
  INITIAL_INQUIRY_FORM_STATE,
  type InquiryFormState,
  type InquiryFormStatus,
} from "./inquiry-form";

export function useInquiryForm() {
  const [form, setForm] = useState<InquiryFormState>(INITIAL_INQUIRY_FORM_STATE);
  const [status, setStatus] = useState<InquiryFormStatus>({ kind: "idle" });

  const isSubmitting = status.kind === "submitting";

  const updateField = <K extends keyof InquiryFormState>(
    name: K,
    value: InquiryFormState[K]
  ) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setStatus({ kind: "submitting" });

    const result = await submitInquiry(
      buildInquiryInputFromForm(form, document.referrer || undefined)
    );

    if (result.ok) {
      setForm(INITIAL_INQUIRY_FORM_STATE);
      setStatus({
        kind: "success",
        message: getInquiryFeedbackMessage(result),
      });
      return;
    }

    setStatus({
      kind: "error",
      message: getInquiryFeedbackMessage(result),
    });
  };

  return { form, status, isSubmitting, updateField, handleSubmit };
}
