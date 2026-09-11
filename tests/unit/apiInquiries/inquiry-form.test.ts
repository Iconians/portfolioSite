import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  buildInquiryInputFromForm,
  getInquiryFeedbackMessage,
  INITIAL_INQUIRY_FORM_STATE,
  INQUIRY_FORM_FIELDS,
  INQUIRY_MESSAGE_MAX_LENGTH,
  INQUIRY_WEBSITE_MAX_LENGTH,
} from "@/lib/apiInquiries/inquiry-form";

describe("inquiry form helpers", () => {
  test("buildInquiryInputFromForm maps company and referrer", () => {
    const payload = buildInquiryInputFromForm(
      {
        ...INITIAL_INQUIRY_FORM_STATE,
        name: "Grace Hopper",
        email: "grace@example.com",
        message: "Hello",
        company: "US Navy",
        website: "",
      },
      "https://engineering.example/about"
    );

    expect(payload).toEqual({
      name: "Grace Hopper",
      email: "grace@example.com",
      message: "Hello",
      company: "US Navy",
      source: "engineering_portfolio",
      referrer: "https://engineering.example/about",
      website: "",
    });
  });

  test("feedback messages stay user-friendly", () => {
    expect(getInquiryFeedbackMessage({ ok: true }).includes("Thanks")).toBe(true);
    expect(
      getInquiryFeedbackMessage({ ok: false, reason: "validation" }).includes(
        "validation"
      )
    ).toBe(false);
    expect(
      getInquiryFeedbackMessage({ ok: false, reason: "rate_limited" }).includes(
        "Too many requests"
      )
    ).toBe(true);
    expect(
      getInquiryFeedbackMessage({
        ok: false,
        reason: "rate_limited",
        retryAfterSeconds: 45,
      }).includes("45")
    ).toBe(true);
    expect(
      getInquiryFeedbackMessage({ ok: false, reason: "unavailable" }).includes(
        "try again later"
      )
    ).toBe(true);
  });

  test("field config mirrors API max lengths", () => {
    expect(INQUIRY_FORM_FIELDS.find((field) => field.name === "name")?.maxLength).toBe(
      100
    );
    expect(INQUIRY_FORM_FIELDS.find((field) => field.name === "email")?.maxLength).toBe(
      254
    );
    expect(INQUIRY_FORM_FIELDS.find((field) => field.name === "company")?.maxLength).toBe(
      200
    );
    expect(INQUIRY_MESSAGE_MAX_LENGTH).toBe(5000);
    expect(INQUIRY_WEBSITE_MAX_LENGTH).toBe(100);
  });
});

describe("CtaForm component contract", () => {
  const source = readFileSync(
    fileURLToPath(
      new URL("../../../src/lib/apiInquiries/ctaForm.tsx", import.meta.url)
    ),
    "utf8"
  );

  test("renders expected fields with accessible labels", () => {
    expect(source.includes("htmlFor={name}")).toBe(true);
    expect(source.includes('htmlFor="message"')).toBe(true);
    expect(source.includes('placeholder="Message (required)"')).toBe(true);
    expect(source.includes("sr-only")).toBe(true);
  });

  test("required attributes and max lengths are present", () => {
    expect(source.includes("required")).toBe(true);
    expect(source.includes("maxLength={INQUIRY_MESSAGE_MAX_LENGTH}")).toBe(true);
    expect(source.includes("maxLength={INQUIRY_WEBSITE_MAX_LENGTH}")).toBe(true);
  });

  test("honeypot remains a normal text input hidden from keyboard navigation", () => {
    expect(source.includes('type="text"')).toBe(true);
    expect(source.includes('name="website"')).toBe(true);
    expect(source.includes("tabIndex={-1}")).toBe(true);
    expect(source.includes('className="honeypot"')).toBe(true);
    expect(source.includes('type="hidden"')).toBe(false);
  });

  test("submit disables while pending and uses friendly status UI", () => {
    const hookSource = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/apiInquiries/use-inquiry-form.ts",
          import.meta.url
        )
      ),
      "utf8"
    );
    const bannerSource = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/apiInquiries/inquiry-status-banner.tsx",
          import.meta.url
        )
      ),
      "utf8"
    );

    expect(source.includes("disabled={isSubmitting}")).toBe(true);
    expect(hookSource.includes("if (isSubmitting)")).toBe(true);
    expect(bannerSource.includes('aria-live="polite"')).toBe(true);
    expect(hookSource.includes("error: ${result.reason}")).toBe(false);
    expect(hookSource.includes("getInquiryFeedbackMessage")).toBe(true);
    expect(hookSource.includes("setForm(INITIAL_INQUIRY_FORM_STATE)")).toBe(true);
  });
});
