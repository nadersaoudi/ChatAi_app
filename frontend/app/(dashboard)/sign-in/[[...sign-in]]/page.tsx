/**
 * Minimal sign-in: centered Clerk card on the app background.
 * The card follows the theme via appearance CSS vars (light :root / .dark).
 */
import { SignIn } from "@clerk/nextjs";
import Logo from "@/components/layout/Logo";

export default function Page() {
  return (
    <div className="app-bg flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="flex items-center gap-2.5">
        <span className="brand-gradient rounded-xl p-2">
          <Logo />
        </span>
        <span className="text-xl font-semibold tracking-tight">
          Code<span className="text-gradient">nix</span>
        </span>
      </div>
      <SignIn
        forceRedirectUrl="/dashboard"
        appearance={{
          layout: {
            logoImageUrl: "/icon.svg",
            logoPlacement: "inside",
          },
          variables: {
            fontFamily: "var(--font-sans)",
            borderRadius: "var(--radius)",
            colorPrimary: "var(--primary)",
            colorBackground: "var(--card)",
            colorInputBackground: "var(--secondary)",
            colorInputText: "var(--foreground)",
            colorText: "var(--foreground)",
            colorTextSecondary: "var(--muted-foreground)",
            colorDanger: "var(--destructive)",
          },
          elements: {
            card: {
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.35)",
              border: "1px solid var(--border)",
            },
            headerTitle: { fontWeight: 700 },
            formButtonPrimary: {
              textTransform: "none",
              fontWeight: 600,
            },
          },
        }}
      />
    </div>
  );
}
