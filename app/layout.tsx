import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WalletProvider from "../components/WalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solana Wallet Dashboard",
  description: "Connect Phantom wallet, view balance, and transaction history",
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
