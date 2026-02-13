/**
 * Feature flags. Set to true to enable admin approval flow and show admin UI.
 * When false: all lawyers are auto-approved, admin approval pages are hidden from navigation.
 */
export const ENABLE_ADMIN_APPROVALS =
  process.env.NEXT_PUBLIC_ENABLE_ADMIN_APPROVALS === "true";
