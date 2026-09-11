import {
  buildInquiryRequestBody,
  type InquirySubmitResult,
} from "./inquires";

export type InquiryFormFieldName = "name" | "email" | "company";

export type InquiryFormField = {
  name: InquiryFormFieldName;
  type: string;
  label: string;
  placeholder: string;
  required?: boolean;
  maxLength: number;
  autoComplete?: string;
};

export type InquiryFormState = {
  name: string;
  email: string;
  company: string;
  message: string;
  website: string;
};

export const INITIAL_INQUIRY_FORM_STATE: InquiryFormState = {
  name: "",
  email: "",
  company: "",
  message: "",
  website: "",
};

export const INQUIRY_FORM_FIELDS: InquiryFormField[] = [
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "Name (required)",
    required: true,
    maxLength: 100,
    autoComplete: "name",
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Email (required)",
    required: true,
    maxLength: 254,
    autoComplete: "email",
  },
  {
    name: "company",
    type: "text",
    label: "Company",
    placeholder: "Company",
    maxLength: 200,
    autoComplete: "organization",
  },
];

export const INQUIRY_MESSAGE_MAX_LENGTH = 5000;
export const INQUIRY_WEBSITE_MAX_LENGTH = 100;

export function buildInquiryInputFromForm(
  form: InquiryFormState,
  referrer: string | undefined
) {
  return buildInquiryRequestBody({
    name: form.name,
    email: form.email,
    message: form.message,
    company: form.company,
    referrer,
    website: form.website,
  });
}

export function getInquiryFeedbackMessage(result: InquirySubmitResult): string {
  if (result.ok) {
    return "Thanks for reaching out. Your message has been sent.";
  }

  switch (result.reason) {
    case "validation":
      return "Please check your entries and try again.";
    case "too_large":
      return "Your message is too long. Please shorten it and try again.";
    case "rate_limited":
      if (result.retryAfterSeconds) {
        return `Too many requests. Please wait ${result.retryAfterSeconds} seconds and try again.`;
      }
      return "Too many requests. Please wait a moment and try again.";
    case "unavailable":
      return "We could not send your message right now. Please try again later.";
  }
}

export type InquiryFormStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };
