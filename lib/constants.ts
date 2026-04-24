export const CASE_STATUSES = [
  "draft",
  "submitted",
  "ai_processing",
  "physician_review",
  "delivered",
  "cancelled",
] as const;

export const USER_ROLES = ["patient", "physician", "admin"] as const;
