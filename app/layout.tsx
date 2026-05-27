import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "InvestAI — Análise Probabilística de Investimentos",
    template: "%s | InvestAI",
  },
  description:
    "Plataforma de análise probabilística do mercado financeiro para ações, ETFs e FIIs. Indicadores técnicos, IA e dados fundamentalistas para investidores brasileiros.",
  keywords: ["investimentos", "ações", "FIIs", "ETFs", "análise técnica", "B3", "mercado financeiro"],
  authors: [{ name: "InvestAI" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "InvestAI — Análise Probabilística de Investimentos",
    description: "Análise probabilística avançada do mercado financeiro para investidores brasileiros.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <QueryProvider>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "oklch(0.13 0.015 275)",
              border: "1px solid oklch(0.22 0.02 275)",
              color: "oklch(0.95 0 0)",
            },
          }}
        />
        </QueryProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
