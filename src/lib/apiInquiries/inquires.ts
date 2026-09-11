export const INQUIRIES_API_URL =
  "https://api.devlaunchsystems.com/api/v1/inquiries";

export type InquirySubmitInput = {
  name: string;
  email: string;
  message: string;
  source: "engineering_portfolio";
  company?: string;
  referrer?: string;
  website?: string;
};

export type InquirySubmitResult =
  | { ok: true }
  | {
      ok: false;
      reason: "too_large" | "validation" | "rate_limited" | "unavailable";
      retryAfterSeconds?: number;
    };

type StatusHandler = (response: Response) => InquirySubmitResult;

export function parseRetryAfter(response: Response): number | undefined {
  const value = response.headers.get("Retry-After");

  if (!value) {
    return undefined;
  }

  const seconds = Number.parseInt(value, 10);

  return Number.isNaN(seconds) ? undefined : seconds;
}

const statusHandlers: Partial<Record<number, StatusHandler>> = {
  413: () => ({
    ok: false,
    reason: "too_large",
  }),

  422: () => ({
    ok: false,
    reason: "validation",
  }),

  429: (response) => ({
    ok: false,
    reason: "rate_limited",
    retryAfterSeconds: parseRetryAfter(response),
  }),
};

export function mapInquiryResponse(response: Response): InquirySubmitResult {
  if (response.status === 201) {
    return { ok: true };
  }

  const handler = statusHandlers[response.status];

  return (
    handler?.(response) ?? {
      ok: false,
      reason: "unavailable",
    }
  );
}

export function buildInquiryRequestBody(input: {
  name: string;
  email: string;
  message: string;
  company?: string;
  referrer?: string;
  website?: string;
}): InquirySubmitInput {
  const company = input.company?.trim();

  return {
    name: input.name,
    email: input.email,
    message: input.message,
    source: "engineering_portfolio",
    website: input.website ?? "",
    ...(company ? { company } : {}),
    ...(input.referrer?.trim() ? { referrer: input.referrer.trim() } : {}),
  };
}

export async function submitInquiry(
  input: {
    name: string;
    email: string;
    message: string;
    company?: string;
    referrer?: string;
    website?: string;
  }
): Promise<InquirySubmitResult> {
  try {
    const response = await fetch(INQUIRIES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildInquiryRequestBody(input)),
    });

    return mapInquiryResponse(response);
  } catch {
    return {
      ok: false,
      reason: "unavailable",
    };
  }
}
