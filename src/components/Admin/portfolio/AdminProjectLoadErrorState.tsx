interface AdminProjectLoadErrorStateProps {
  message: string;
}

export function AdminProjectLoadErrorState({
  message,
}: AdminProjectLoadErrorStateProps) {
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
      <p className="font-medium">Platform admin load failed</p>
      <p className="mt-2">{message}</p>
      <p className="mt-3 text-muted-foreground">
        Project content was not loaded from Portfolio database as a fallback. Verify
        Platform API configuration and service credentials.
      </p>
    </div>
  );
}
