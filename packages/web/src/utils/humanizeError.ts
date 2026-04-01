export function humanizeError(err: unknown): string {
  const msg =
    err instanceof Error
      ? err.message
      : typeof err === "string"
        ? err
        : "Something went wrong";

  const lower = msg.toLowerCase();

  // --- User actions ---
  if (lower.includes("user rejected") || lower.includes("user denied"))
    return "You rejected the request in your wallet";

  // --- Wrong network ---
  if (lower.includes("chain's id does not match"))
    return "Your wallet is on the wrong network — switch to Seismic Testnet";
  if (
    lower.includes("not deployed on chain") ||
    lower.includes("address not yet configured")
  )
    return "This network isn't supported — connect to Seismic Testnet";
  if (lower.includes("client must have a chain"))
    return "No network detected — reconnect your wallet";

  // --- Wallet init (seismic-react) ---
  if (lower.includes("connector not fetched"))
    return "Wallet connection lost — try reconnecting";
  if (
    lower.includes("no account connected") ||
    lower.includes("account must not be null")
  )
    return "No account found — unlock your wallet and try again";
  if (
    lower.includes("no chain connected") ||
    lower.includes("no transport connected")
  )
    return "Wallet connected but no network detected — switch to Seismic Testnet";

  // --- Encryption / shielded tx (seismic-viem) ---
  if (
    lower.includes("encryption public key") ||
    lower.includes("encryptionpubkey")
  )
    return "Your wallet doesn't support shielded transactions — use a Seismic-compatible wallet";
  if (lower.includes("encryption nonce") || lower.includes("encryptionnonce"))
    return "Failed to generate encryption nonce — please retry";
  if (lower.includes("expiresatblock") || lower.includes("in the past"))
    return "Transaction expired before it was sent — please retry";
  if (
    lower.includes("accounttypenotsupported") ||
    lower.includes("account type not supported")
  )
    return "This account type isn't supported for shielded transactions";

  // --- Token deployment ---
  if (lower.includes("tokencreated event not found"))
    return "Token was deployed but the address couldn't be confirmed — check your wallet for the transaction";

  // --- Funds & gas ---
  if (lower.includes("insufficient funds"))
    return "Insufficient funds to cover gas — top up your wallet";

  // --- Network / RPC ---
  if (
    lower.includes("network") ||
    lower.includes("fetch") ||
    lower.includes("timeout") ||
    lower.includes("connection") ||
    lower.includes("econnrefused")
  )
    return "Network error — check your connection and try again";

  return "Something went wrong — please try again";
}
