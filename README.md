# Decentralized Disaster Relief Fund DAO: Technical Documentation

## 1.0 Introduction

### 1.1 Project Synopsis

The Decentralized Disaster Relief Fund DAO is a novel application of Web3 technologies conceived to address and rectify systemic inefficiencies prevalent in traditional humanitarian aid frameworks. Developed as a proof-of-concept, the project demonstrates a new paradigm for the collection and distribution of funds in crisis scenarios. It represents an ambitious effort to apply the principles of decentralization to a domain where speed, trust, and accountability are of paramount importance.

### 1.2 Core Proposition

The central thesis of the project is the strategic application of blockchain technology's inherent properties—namely transparency, speed, and immutability—to engineer a more efficient, accountable, and globally accessible disaster relief mechanism. The project's official tagline, "Rapid, Transparent Aid via Web3", encapsulates the dual objectives of accelerating the delivery of aid to affected populations while simultaneously restoring donor trust through verifiable, on-chain financial flows.

---

## 2.0 Getting Started (Developer Setup)

### 2.1 Prerequisites
- Node.js v18.0 or later
- `npm` or `yarn` package manager
- A Solana wallet browser extension (e.g., Phantom, Solflare)

### 2.2 Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/aadyasharma13/reliefDAO.git
    cd reliefDAO
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### 2.3 Environment Configuration
Create a `.env.local` file in the project root by copying the example file:
```bash
cp .env.example .env.local
```
Update the variables in `.env.local` with your specific configuration:
```env
# URL for the Solana RPC endpoint (e.g., from QuickNode, Helius, or public API)
# Devnet: https://api.devnet.solana.com
# Mainnet: https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"

# The public key of the central treasury wallet that holds the relief funds
TREASURY_WALLET_ADDRESS="YOUR_TREASURY_WALLET_PUBLIC_KEY"

# The mint address of the stablecoin used by the treasury (e.g., USDC)
# Devnet USDC: Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr
# Mainnet USDC: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
TREASURY_USDC_MINT="Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
```

### 2.4 Running the Application
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

---

## 3.0 System Architecture and Component Design

### 3.1 High-Level Architectural Blueprint
The architecture is a dApp consisting of three primary components: the **DAO Treasury**, the **Donation Module**, and the **Payout Module**. These components interact over the Solana blockchain, creating a closed-loop flow defined as "donation → conversion → storage → payout".

### 3.2 The DAO Treasury
-   **Function**: Serves as the on-chain wallet storing the relief funds. All donations, after conversion, are consolidated into this treasury, holding funds in a standardized stablecoin (USDC) to mitigate price volatility.
-   **Prototype Implementation**: Implemented as a standard Solana wallet. The frontend reads this wallet's balance via RPC calls to display the fund's total value in real-time.
-   **Future Trajectory**: Replace the simple wallet with a proper DAO-governed smart contract or a multi-signature wallet (e.g., Squads) to achieve true decentralized custody.

### 3.3 The Donation and Conversion Module
-   **User Interface**: A React-based web application with a simple donation form, integrated with the Solana Wallet Adapter for secure wallet connections.
-   **DeFi Integration**: The technical core is the integration with the **Jupiter API**. When a user donates any SPL token, the application calls Jupiter to find the optimal swap route to convert that token into USDC, maximizing the value captured for the relief fund.
-   **End-to-End Flow**:
    1.  A donor connects their wallet.
    2.  The donor inputs a donation amount in any SPL token.
    3.  The application calls the internal `/api/quote` endpoint, which in turn calls Jupiter's `/v6/quote` API.
    4.  The application uses the quote to construct a swap transaction via the `/api/swap` endpoint (which calls Jupiter's `/v6/swap` API).
    5.  The user signs the transaction, and the resulting USDC is deposited into the DAO Treasury.

### 3.4 The Payout Module
-   **Functionality**: Handles automated, programmatic aid distribution from the DAO Treasury to a list of pre-configured beneficiary wallets.
-   **Prototype Logic**: Implemented as a client-side script that can be triggered from the dApp. It uses a hardcoded rule (e.g., "distribute 50% of funds equally to 2 wallets") to demonstrate the concept.
-   **Execution Mechanism**: The logic runs in a lightweight Node script or directly in the frontend, using `@solana/web3.js` to construct and send the SPL token transfer transactions from the treasury wallet to beneficiaries. This avoids the complexity of on-chain program development for the prototype.

---

## 4.0 Technology Stack

| Technology/Tool                  | Category             | Role in Prototype                                                                                  | Rationale for Selection                                                            |
| -------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Solana**                       | Blockchain Platform  | The underlying ledger for all transactions and token operations.                                   | High speed and low fees are ideal for urgent, high-volume transactions.            |
| **React (Next.js)**              | Frontend Framework   | Building the entire user interface, including the donation form and dashboard.                     | Enables rapid development of a responsive, server-rendered, and type-safe dApp.    |
| **@solana/wallet-adapter-react** | Frontend Library     | Provided seamless, one-click connectivity to Solana wallets.                                       | Abstracted wallet connection complexity, improving UX and accelerating development. |
| **Jupiter API**                  | DeFi Aggregator      | Handled all token swaps, converting any donated SPL token into USDC at the best available rate.    | Provides access to ecosystem-wide liquidity via a single API.                      |
| **Node.js / Next.js API Routes** | Backend              | Serves as a lightweight backend proxy for secure communication with external APIs like Jupiter.    | Minimalist approach to avoid heavy backend development.                            |
| **Tailwind CSS**                 | Styling              | Provided utility classes for rapidly building a modern and responsive user interface.              | Efficiency and maintainability in styling.                                         |
| **TypeScript**                   | Language             | Used across the entire stack for type safety and improved developer experience.                    | Reduces bugs and improves code clarity.                                            |

---

## 5.0 API Reference

The application exposes several internal API endpoints that are primarily consumed by the frontend.

### 5.1 `GET /api/quote`
Fetches a real-time swap quote from the Jupiter API.

-   **Method**: `GET`
-   **Query Parameters**:
    -   `inputMint` (string, required): The mint address of the token being donated.
    -   `outputMint` (string, required): The mint address of the token to receive (i.e., USDC).
    -   `amount` (string, required): The amount of the input token to swap, in its smallest unit (lamports).
    -   `slippage` (string, optional): The slippage tolerance in basis points (e.g., `50` for 0.5%). Defaults to `50`.
-   **Success Response (200)**:
    ```json
    {
      "success": true,
      "data": { /* Jupiter Quote API Response Object */ }
    }
    ```
-   **Error Response (400/500)**:
    ```json
    {
      "error": "Error message",
      "details": "Detailed error information"
    }
    ```

### 5.2 `POST /api/swap`
Generates the transaction data required to perform a swap using the Jupiter API.

-   **Method**: `POST`
-   **Body**:
    ```json
    {
      "quoteResponse": { /* The quote object received from /api/quote */ },
      "userPublicKey": "USER_WALLET_PUBLIC_KEY",
      "destinationWallet": "TREASURY_WALLET_PUBLIC_KEY"
    }
    ```
-   **Success Response (200)**:
    ```json
    {
      "success": true,
      "data": {
        "swapTransaction": "BASE64_ENCODED_TRANSACTION",
        "lastValidBlockHeight": 123456
        /* ... Other Jupiter Swap API response fields */
      }
    }
    ```

### 5.3 `GET /api/treasury/balance`
Retrieves the current balance of the DAO treasury wallet and recent transaction history.

-   **Method**: `GET`
-   **Success Response (200)**:
    ```json
    {
      "success": true,
      "data": {
        "treasuryAddress": "TREASURY_WALLET_PUBLIC_KEY",
        "balances": {
          "sol": 10.5,
          "usdc": 50000.75
        },
        "recentTransactions": [
          {
            "signature": "...",
            "blockTime": 1672531200,
            "success": true
          }
        ]
      }
    }
    ```

### 5.4 `POST /api/payout/execute`
(Admin-only) Creates and returns an unsigned transaction to execute a payout from the treasury. The frontend is responsible for getting this transaction signed by the treasury wallet holder.

-   **Method**: `POST`
-   **Body**:
    ```json
    {
      "recipientAddress": "RECIPIENT_WALLET_PUBLIC_KEY",
      "amount": 5000000000, // Amount in smallest unit (e.g., 5000 USDC with 6 decimals)
      "disasterEventId": "HURRICANE-IAN-2022"
    }
    ```
-   **Success Response (200)**:
    ```json
    {
      "success": true,
      "data": {
        "unsignedTransaction": "BASE64_ENCODED_UNSIGNED_TRANSACTION"
      }
    }
    ```

---

## 6.0 Usage Instructions

### 6.1 Making a Donation
1.  Navigate to the web application and click "Connect Wallet".
2.  Select your wallet provider (e.g., Phantom) and approve the connection.
3.  Go to the "Donate" page.
4.  Select the token you wish to donate from the dropdown list.
5.  Enter the amount you wish to contribute. The UI will automatically fetch and display the equivalent amount of USDC you are donating based on the current market rate from Jupiter.
6.  Click "Donate Now".
7.  A transaction approval request will appear in your wallet. Review and approve it.
8.  Once the transaction is confirmed on the Solana blockchain, a success notification will appear, and the dashboard will update to reflect your contribution.

### 6.2 Triggering a Payout (Administrator)
1.  Navigate to the "Trigger" page (this page may be access-restricted in a production environment).
2.  Select a predefined disaster event or manually input payout parameters.
3.  The system will determine the payout amounts and destinations based on its hardcoded rules.
4.  Click "Trigger Payouts".
5.  The application will construct the necessary payout transactions.
6.  The treasury holder will be prompted to sign these transactions via their connected wallet to authorize the release of funds.
7.  The "Payout Log" will update with links to view the on-chain transactions on a block explorer.

---

## 7.0 Future Vision

The hackathon build is the first step. The future vision involves maturing the prototype into a fully decentralized and robust platform:

-   **Full DAO Governance**: Implement a governance token to allow donors to vote on key parameters like payout rules, beneficiary vetting, and treasury management strategies.
-   **On-Chain Programs**: Replace the simplified components with secure, audited on-chain smart contracts. This includes moving the treasury to a multi-sig or program-controlled wallet and migrating the payout logic to an autonomous on-chain program.
-   **Oracle Integration**: Integrate decentralized oracles for automated disaster event detection, removing the need for a manual trigger and further increasing the speed and decentralization of the response.

## 8.0 Conclusion

The Decentralized Disaster Relief Fund DAO provides a working demonstration of a viable technological pathway toward a more efficient, transparent, and inclusive model for humanitarian aid. Its architecture showcases powerful and emerging design patterns—most notably "Financial Abstraction" via the Jupiter API and strategic simplification for rapid prototyping—that hold valuable lessons for the wider Web3 development ecosystem. The project successfully makes the case that with the right design, the sophisticated tools of decentralized finance can be harnessed to create profound social impact.
