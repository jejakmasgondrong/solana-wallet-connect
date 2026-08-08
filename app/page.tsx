"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  Connection,
  LAMPORTS_PER_SOL,
  type ConfirmedSignatureInfo,
} from "@solana/web3.js";

export default function Home() {
  const { connected, publicKey } = useWallet();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [balance, setBalance] = useState<number | null>(null);
  const [network, setNetwork] = useState<string>("Devnet");
  const [transactions, setTransactions] = useState<ConfirmedSignatureInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletData = useCallback(async () => {
    if (!publicKey) return;
    setLoading(true);
    setError(null);
    try {
      const connection = new Connection("https://api.devnet.solana.com");

      const balanceInLamports = await connection.getBalance(publicKey);
      setBalance(balanceInLamports / LAMPORTS_PER_SOL);

      setNetwork("Devnet");

      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit: 10,
      });
      setTransactions(signatures);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      setError(
        "Failed to fetch wallet data. Check your connection or the RPC endpoint."
      );
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    if (connected && publicKey) {
      window.setTimeout(() => fetchWalletData(), 0);
    }
  }, [connected, publicKey, fetchWalletData]);

  const formatDate = (timestamp: number | null | undefined) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            💰 Solana Wallet
          </h1>
          {mounted ? (
            <WalletMultiButton />
          ) : (
            <button className="wallet-adapter-button">
              Connect Wallet
            </button>
          )}
        </div>

        <p className="mb-8 text-center text-sm text-purple-200/90 max-w-2xl mx-auto">
          Connect your Phantom or Solflare wallet to inspect live Solana devnet
          data. This dashboard shows your wallet address, current network,
          SOL balance, and recent transaction history — everything settles
          on-chain and is read directly from the Solana network.
        </p>

        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <h2 className="text-purple-300 text-sm font-semibold mb-1">Live Balance</h2>
            <p className="text-xs text-white/70">
              See your SOL balance in real time, refreshed straight from the
              devnet cluster as soon as your wallet connects.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <h2 className="text-purple-300 text-sm font-semibold mb-1">Transaction History</h2>
            <p className="text-xs text-white/70">
              Browse your recent on-chain activity with signatures, amounts,
              and timestamps for every confirmed transaction.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
            <h2 className="text-purple-300 text-sm font-semibold mb-1">Wallet-first &amp; Keyless</h2>
            <p className="text-xs text-white/70">
              No account, no password. Your wallet signs each read and the app
              never touches your private keys.
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5 max-w-3xl mx-auto">
          <h2 className="text-purple-300 text-sm font-semibold mb-2">
            Why run a wallet dashboard on devnet?
          </h2>
          <p className="text-xs text-white/70 leading-relaxed">
            A devnet dashboard is a safe place to understand how Solana wallets
            and RPC calls work before touching real funds. You can experiment
            with airdropped SOL, observe how balances refresh, study
            transaction signatures and recent blocks, and learn the wallet
            adapter flow — all without any financial risk. When you are ready,
            the same connection pattern applies to mainnet, which makes this
            dashboard a handy reference for anyone exploring Solana
            development.
          </p>
        </div>

        {/* Wallet Info */}
        {mounted && connected && publicKey ? (
          <div className="space-y-6">
            {/* Address & Network */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-purple-300 text-sm mb-1">Address</p>
                  <p className="text-white font-mono text-sm break-all">
                    {publicKey.toString()}
                  </p>
                </div>
                <div>
                  <p className="text-purple-300 text-sm mb-1">Network</p>
                  <p className="text-green-400 font-semibold">{network || "Connecting..."}</p>
                </div>
              </div>
            </div>

            {/* Balance */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <p className="text-purple-300 text-sm mb-1">Balance</p>
              {loading ? (
                <p className="text-white text-3xl font-bold animate-pulse">Loading...</p>
              ) : (
                <p className="text-white text-3xl font-bold">
                  {balance !== null ? `${balance.toFixed(4)} SOL` : "0 SOL"}
                </p>
              )}
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
              <button
                onClick={fetchWalletData}
                className="mt-4 text-sm bg-purple-500/30 hover:bg-purple-500/50 text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                🔄 Refresh
              </button>
            </div>

            {/* Transaction History */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <p className="text-purple-300 text-sm mb-4">Transaction History</p>
              {loading ? (
                <p className="text-white animate-pulse">Loading transactions...</p>
              ) : transactions.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {transactions.map((tx, index) => (
                    <div
                      key={index}
                      className="bg-white/5 rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white font-mono">
                          {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                        </span>
                        <span className="text-purple-300">
                          {formatDate(tx.blockTime)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1 text-xs">
                        <span className="text-gray-400">
                          Status: {tx.confirmationStatus || "Confirmed"}
                        </span>
                        <a
                          href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          🔗 View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No transactions found</p>
              )}
            </div>
          </div>
        ) : mounted ? (
          <div className="text-center py-20">
            <p className="text-purple-200 text-xl">
              👆 Connect your wallet to get started
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
