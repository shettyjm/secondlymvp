import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "StandbyHealth",
  description:
    "Physician-reviewed, AI-assisted second opinions for families seeking clarity.",
};

const navLinks: Array<{ href: Route; label: string }> = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/legal/disclaimer", label: "Disclaimer" },
  { href: "/login", label: "Login" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
          <header className="sticky top-0 z-20 mb-6 border-b border-white/60 bg-sand/90 backdrop-blur">
            <div className="flex items-center justify-between py-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-sm font-semibold text-white shadow-card">
                  SH
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean">
                    StandbyHealth
                  </p>
                  <p className="text-xs text-slate-500">
                    Physician-reviewed second opinions
                  </p>
                </div>
              </Link>
              <nav className="hidden items-center gap-6 md:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium text-slate-600 hover:text-ink",
                      link.href === "/login" &&
                        "rounded-full border border-line px-4 py-2 hover:border-ocean",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="flex-1 pb-12">{children}</main>
        </div>
      </body>
    </html>
  );
}
