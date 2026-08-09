import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppShell, ThemeScript } from "@/components/layout";
import { APP_NAME } from "@/constants";
import { getCurrentSession } from "@/lib/auth/authorization";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: "Sistema de control y seguimiento de fichas SENA.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full">
        <AppShell
          currentUserName={session?.user.name}
          currentUserRole={session?.user.role}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
