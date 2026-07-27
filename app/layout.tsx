import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppShell, ThemeScript } from "@/components/layout";
import { APP_NAME } from "@/constants";
import { auth } from "@/lib/auth";

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
  const session = await auth();

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
        <AppShell currentUserRole={session?.user.role}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
