import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletProvider from "../components/WalletProvider";

const inter = Inter({ subsets: ["latin"] });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://solana-wallet-connect-ten.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Solana Wallet Connect — Devnet Dashboard & Transaction Explorer",
    template: "%s — Solana Wallet Connect",
  },
  description:
    "Connect your Phantom or Solflare wallet and inspect live Solana devnet data: balance, account info, and recent transaction history in one clean dashboard.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Solana Wallet Connect — Devnet Dashboard",
    description:
      "Inspect live Solana devnet balance and transaction history with a single wallet connect.",
    url: "/",
    type: "website",
    siteName: "Solana Wallet Connect",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solana Wallet Connect — Devnet Dashboard",
    description:
      "Inspect live Solana devnet balance and transaction history with a single wallet connect.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <WalletProvider>{children}</WalletProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Solana Wallet Connect",
              description:
                "Connect a Solana wallet and inspect live devnet balance and transaction history.",
              applicationCategory: "DeveloperApplication",
              url: siteUrl,
              operatingSystem: "Any",
            }),
          }}
        />
        <footer className="border-t border-gray-800 py-4 text-center">
          <a
            href="https://www.linkedin.com/in/rsatriya-wicaksana-56b026ab/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-emerald-400 transition-colors"
          >
            Built by RSatriya · Contact Me
          </a>
        </footer>
      </body>
    </html>
  );
}
