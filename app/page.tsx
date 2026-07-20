"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";

export default function Home() {
  const { connected, publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
        Solana Connect
      </h1>
      <p className="text-xl text-purple-200 mb-12 text-center">
        Wallet Test
      </p>

      <div className="transform transition-all duration-300 hover:scale-105">
        {mounted ? (
          <WalletMultiButton />
        ) : (
          <button className="wallet-adapter-button">
            Connect Wallet
          </button>
        )}
      </div>

      {connected && publicKey && mounted && (
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/20">
          <p className="text-green-400 text-sm font-mono">
            ✅ Connected: {publicKey.toString().slice(0, 6)}...
            {publicKey.toString().slice(-6)}
          </p>
        </div>
      )}
    </main>
  );
}
