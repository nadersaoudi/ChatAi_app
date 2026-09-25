/** Central runtime configuration. */

export const APP_VERSION = "1.0";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const MAX_HISTORY_MESSAGES = 50;
export const MAX_PDF_MB = 20;
