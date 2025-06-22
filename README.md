# ReliefDAO - Decentralized Disaster Relief Platform

A modern, decentralized disaster relief platform built on Solana blockchain that enables instant, transparent, and borderless humanitarian aid through crypto donations and automated smart contracts.

![ReliefDAO](https://img.shields.io/badge/ReliefDAO-Disaster%20Relief%20Platform-blue)
![Solana](https://img.shields.io/badge/Solana-Blockchain-purple)
![Jupiter](https://img.shields.io/badge/Jupiter-DEX-orange)
![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## 🌟 Features

### 🏗️ **Global Layout & Styling**
- Responsive design using Tailwind CSS
- Header with app title and Connect Wallet button
- Footer with Solana & Jupiter credits
- Dark/light theme toggle
- Mobile-responsive sidebar navigation

### 🔗 **Wallet Connection**
- Phantom wallet integration
- Display connected wallet's shortened address
- Network indicator (Mainnet-Beta/Devnet)
- Seamless wallet connection modal

### 💝 **Donation Module**
- Token selector dropdown (SOL, USDC, USDT)
- Real-time Jupiter DEX integration for quotes
- Amount validation and balance checking
- Instant quote fetching with loading states
- Toast notifications for user feedback

### 📊 **DAO Treasury Dashboard**
- Treasury balance display with USDC amounts
- Real-time transaction feed
- Token distribution charts
- Donation statistics and metrics
- Active events tracking

### ⚡ **Disaster Event Trigger**
- Simulate disaster events (Hurricane, Earthquake, Flood, Wildfire)
- Automated payout system
- Confirmation dialogs for safety
- Processing states with visual feedback

### 📋 **Payout Log**
- Event summary with timestamps
- Recipient address tracking
- Transaction amounts in USDC
- "View on Explorer" links for transparency
- Complete payout history

### 🔔 **Notifications & Feedback**
- Toast alerts for all user actions
- Success/error notifications
- Quote fetched confirmations
- Transaction status updates

### 🌍 **Community Features**
- Events page with disaster tracking
- Community member directory
- Recent activity feed
- Achievement badges system
- Community engagement tools

### 🛠️ **Developer Tools**
- Debug panel for API responses
- Network logs viewer
- Request/response inspection
- Copy-to-clipboard functionality

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Phantom wallet browser extension

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aadyasharma13/reliefDAO.git
   cd reliefDAO
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage Guide

### Making a Donation
1. Connect your Phantom wallet
2. Navigate to the "Donate" page
3. Select your preferred token (SOL, USDC, USDT)
4. Enter the amount you wish to donate
5. View the real-time quote from Jupiter DEX
6. Click "Donate Now" to complete the transaction

### Triggering Disaster Relief
1. Go to the "Trigger" page
2. Select the disaster type (Hurricane, Earthquake, etc.)
3. Click "Trigger Payouts" to initiate relief distribution
4. Monitor the payout status in real-time
5. View the complete payout log with transaction details

### Exploring the Dashboard
- View treasury balance and statistics
- Track recent donations and transactions
- Monitor active disaster events
- Explore community member contributions

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **State Management**: React hooks (useState, useEffect)
- **Wallet Integration**: @solana/wallet-adapter-react
- **DEX Integration**: @jup-ag/react-hook

### Key Components
```
components/
├── layout.tsx              # Main layout with sidebar
├── donate-form.tsx         # Donation form with Jupiter integration
├── wallet-connect-button.tsx # Wallet connection component
├── debug-panel.tsx         # Developer tools panel
├── payout-log.tsx          # Payout tracking component
└── ui/                     # Reusable UI components

app/
├── page.tsx               # Homepage
├── donate/page.tsx        # Donation page
├── dashboard/page.tsx     # Treasury dashboard
├── trigger/page.tsx       # Disaster trigger page
├── events/page.tsx        # Events tracking
└── community/page.tsx     # Community features
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_JUPITER_API_URL=https://quote-api.jup.ag/v6
```

### Solana Network
The app is configured for Solana Devnet by default. To switch to Mainnet:
- Update the RPC URL in your environment variables
- Ensure your wallet is connected to the correct network

## 🎨 Customization

### Theming
The app supports dark/light themes with Tailwind CSS. Customize colors in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... add your custom colors
        }
      }
    }
  }
}
```

### Adding New Tokens
To add new tokens for donation, update the `INPUT_TOKENS` array in `components/donate-form.tsx`:

```typescript
const INPUT_TOKENS = [
  { symbol: 'SOL', mint: 'So11111111111111111111111111111111111111112', decimals: 9 },
  { symbol: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 },
  // Add your new token here
];
```

## 🔍 Debug Panel

The debug panel provides real-time insights into:
- API calls and responses
- Network requests
- Error tracking
- Transaction details

**To access**: Click the code icon (</>) in the header to toggle the debug panel.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Solana Foundation** for the blockchain infrastructure
- **Jupiter** for DEX aggregation services
- **Phantom** for wallet integration
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first styling

## 📞 Support

For support, email support@reliefdao.com or join our Discord community.

---

**Built with ❤️ for disaster relief and humanitarian aid**

*ReliefDAO - Making disaster relief instant, transparent, and borderless through blockchain technology.* 