import { ClerkProvider } from "@clerk/nextjs";

/**
 * Authenticated section (dashboard + sign-in). Clerk loads ONLY here —
 * the marketing pages stay free of the clerk-js bundle.
 *
 * force-dynamic: per-user routes, never prerendered at build time (so
 * `next build` succeeds without Clerk keys; keys are required at runtime).
 */
export const dynamic = "force-dynamic";

export default function DashboardGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      {children}
    </ClerkProvider>
  );
}
