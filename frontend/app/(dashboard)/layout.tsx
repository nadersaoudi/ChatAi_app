import { ClerkProvider } from "@clerk/nextjs";

/**
 * Authenticated section (dashboard + sign-in). Clerk loads ONLY here —
 * the marketing pages stay free of the clerk-js bundle.
 */
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
