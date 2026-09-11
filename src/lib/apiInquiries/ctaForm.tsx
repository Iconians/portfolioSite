"use client";

import { Button } from "@/components/ui/button";

import {
  INQUIRY_FORM_FIELDS,
  INQUIRY_MESSAGE_MAX_LENGTH,
  INQUIRY_WEBSITE_MAX_LENGTH,
  type InquiryFormField,
} from "./inquiry-form";
import { InquiryStatusBanner } from "./inquiry-status-banner";
import { useInquiryForm } from "./use-inquiry-form";

type FormInputProps = InquiryFormField & {
  value: string;
  onChange: (name: InquiryFormField["name"], value: string) => void;
};

function FormInput({
  name,
  type,
  label,
  placeholder,
  required,
  maxLength,
  autoComplete,
  value,
  onChange,
}: FormInputProps) {
  return (
    <div className="min-w-0 flex-1">
      <label htmlFor={name} className="sr-only">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full rounded-md border border-gray-300 p-2"
        required={required}
        autoComplete={autoComplete}
        maxLength={maxLength}
      />
    </div>
  );
}

export function CtaForm() {
  const { form, status, isSubmitting, updateField, handleSubmit } =
    useInquiryForm();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <InquiryStatusBanner status={status} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="on">
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          {INQUIRY_FORM_FIELDS.slice(0, 2).map((field) => (
            <FormInput
              key={field.name}
              {...field}
              value={form[field.name]}
              onChange={(name, value) => updateField(name, value)}
            />
          ))}
        </div>
        <FormInput
          {...INQUIRY_FORM_FIELDS[2]}
          value={form.company}
          onChange={(name, value) => updateField(name, value)}
        />
        <div>
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <textarea
            id="message"
            placeholder="Message (required)"
            name="message"
            value={form.message}
            rows={5}
            onChange={(e) => updateField("message", e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
            required
            autoComplete="off"
            maxLength={INQUIRY_MESSAGE_MAX_LENGTH}
          />
        </div>
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website" className="sr-only">
            Website
          </label>
          <input
            id="website"
            type="text"
            name="website"
            value={form.website}
            onChange={(e) => updateField("website", e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            maxLength={INQUIRY_WEBSITE_MAX_LENGTH}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
