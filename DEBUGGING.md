# Debugging Notes — Solana Wallet Connect

Common issues encountered during development and their verified fixes.

## 1. `createClient()` chain order — wallet signer must precede RPC

**Symptom:** "Payer not found" or missing identity when sending a transaction.

**Root cause:** In `@solana/kit`, the wallet signer plugin must be registered before the RPC plugin because the RPC layer consumes the payer/identity from the wallet.

**Fix:**

```ts
createClient()
  .use(walletSigner({ chain }))   // must come first
  .use(solanaRpc({ rpcUrl, rpcSubscriptionsUrl }))
  .use(rpcAirdrop())
  ...
```

## 2. Token action fails with "associated token account not found"

**Symptom:** createMint works but transferToATA/openAccount fails.

**Root cause:** Missing the associated token account instruction in the plan.

**Fix:** Use the kit plugin's `getOrCreateAssociatedTokenAccount` helper (or add an explicit `createAccount`/ATA init instruction as the first instruction of the transaction).

## 3. Airdrop only works on non-mainnet clusters

**Symptom:** Airdrop returns an error on mainnet (intended).

**Root cause:** `rpcAirdrop()` is registered for devnet/testnet/localnet only; mainnet does not support airdrops.

**Fix:** Keep the fallback default RPC to devnet and use the [faucet](https://faucet.solana.com/) for mainnet-free dev testing.

## 4. Wallet connect issues

**Symptom:** The connect modal is empty or a wallet isn't detected.

**Common causes:**
- Wallet-standard discovery needs the wallet extension installed & unlocked.
- On localhost over a network IP, browsers may restrict wallet popups — use `http://localhost:3000`.

## 5. Subscription errors on Vercel

**Symptom:** Realtime balance updates don't work on serverless hosts.

**Root cause:** `wss` subscriptions require a persistent websocket connection; serverless environments may drop long-lived sockets.

**Fix:** For production, prefer periodic `getBalance` polling (see `app/lib/lamports.ts`) over long-lived subscriptions.

---

Keep this file updated: whenever a new issue is debugged, add the symptom / root cause / fix above.