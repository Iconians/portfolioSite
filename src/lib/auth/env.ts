const MIN_AUTH_SECRET_LENGTH = 32;
const DEV_AUTH_SECRET = "development-only-auth-secret-min-32-chars!!";

export function validateAuthEnvironment(): void {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const authSecret = process.env.AUTH_SECRET?.trim();

  if (!authSecret) {
    console.error(
      "AUTH_SECRET is required in production. Set it in your deployment environment."
    );
    return;
  }

  if (authSecret.length < MIN_AUTH_SECRET_LENGTH) {
    console.error(
      `AUTH_SECRET must be at least ${MIN_AUTH_SECRET_LENGTH} characters in production.`
    );
  }
}

export function getAuthSecret(): string {
  const authSecret = process.env.AUTH_SECRET?.trim();
  return authSecret || DEV_AUTH_SECRET;
}
