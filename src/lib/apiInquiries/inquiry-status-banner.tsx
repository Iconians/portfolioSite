import type { InquiryFormStatus } from "./inquiry-form";

export function InquiryStatusBanner({ status }: { status: InquiryFormStatus }) {
  if (status.kind === "idle" || status.kind === "submitting") {
    return null;
  }

  const tone =
    status.kind === "success"
      ? "border-green-600/40 bg-green-600/10 text-foreground"
      : "border-destructive/40 bg-destructive/10 text-foreground";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-md border p-3 text-sm ${tone}`}
    >
      {status.message}
    </div>
  );
}
