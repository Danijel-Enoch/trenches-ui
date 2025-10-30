# Trenches - Prediction Market Platform

A decentralized prediction market platform built with Next.js, RainbowKit, and Viem. Users can create markets for any token on DexScreener and place bets on price movements.

## Features

- 🎯 **Create Markets**: Create prediction markets for any token
- 📊 **Trade Positions**: Buy UP or DOWN outcome tokens
- 💰 **Automated Settlement**: Markets settle automatically at midnight via keeper bots
- 🏆 **Claim Winnings**: Winners can sell tokens or claim winnings
- 🔐 **Web3 Wallet Integration**: Connect with MetaMask, WalletConnect, and more via RainbowKit
- ✨ **Sleek UI**: Beautiful animations and modern design with Framer Motion

## Tech Stack

- **Next.js 16** - React framework
- **RainbowKit** - Wallet connection
- **Wagmi & Viem** - Ethereum interactions
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **TypeScript** - Type safety

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Yarn or npm
- A WalletConnect Project ID (get one at [cloud.walletconnect.com](https://cloud.walletconnect.com/))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd trenches-ui
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=0x_your_deployed_contract_address
NEXT_PUBLIC_SHARE_TOKEN_ADDRESS=0x_your_share_token_address
```

4. Update contract addresses in `lib/contracts.ts`:
```typescript
export const PredictionMarket = "0x_your_deployed_contract_address"
export const shareToken = "0x_your_share_token_address"
```

### Development

Run the development server:
```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
yarn build
yarn start
```

## Project Structure

```
trenches-ui/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── market/[id]/      # Get market data
│   │   └── user-position/    # Get user positions
│   ├── create/               # Create market page
│   ├── positions/            # User positions page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page (markets list)
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── navbar.tsx            # Navigation bar
│   ├── market-card.tsx       # Market card component
│   └── ui.tsx                # Reusable UI components
├── lib/                      # Utilities and configuration
│   ├── contracts.ts          # Contract ABIs and addresses
│   ├── providers.tsx         # Web3 providers
│   ├── wagmi.ts              # Wagmi configuration
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Helper functions
└── public/                   # Static assets
```

## Smart Contract Integration

The platform integrates with two smart contracts:

### PredictionMarket Contract

Key functions:
- `createMarket(tokenAddress, initialPrice)` - Create a new market
- `buyShares(marketId, outcome, shares)` - Buy outcome tokens
- `sellShares(marketId, outcome, shares)` - Sell outcome tokens  
- `claimWinnings(marketId)` - Claim winnings after settlement
- `getMarketInfo(marketId)` - Get market details
- `getUserShares(marketId, user, outcome)` - Get user's position

### Outcome Types

- `UP (0)` - Token price goes up
- `DOWN (1)` - Token price goes down

## Features Detail

### Creating Markets

1. Navigate to "Create Market"
2. Enter token address or symbol from DexScreener
3. Set the initial price
4. Pay creation fee (0.01 ETH)
5. Market is created and settles at midnight (00:00 UTC)

### Trading

1. Browse available markets on the home page
2. Select UP or DOWN outcome
3. Enter the amount of shares to buy
4. Confirm the transaction
5. Shares are minted to your wallet

### Managing Positions

1. Visit "My Positions"
2. View all your active and settled positions
3. Sell shares before settlement
4. Claim winnings after market settles (winners only)

### Settlement

- Markets automatically settle at midnight (00:00 UTC)
- Keeper bots fetch final prices and determine winners
- UP wins if final price > initial price
- DOWN wins if final price < initial price
- Winners can claim winnings, losers cannot sell

## Configuration

### Supported Networks

Update `lib/wagmi.ts` to add/remove chains:
```typescript
chains: [mainnet, sepolia, base, baseSepolia]
```

### Theme Customization

Modify the RainbowKit theme in `lib/providers.tsx`:
```typescript
theme={darkTheme({
  accentColor: '#7b3fe4',
  accentColorForeground: 'white',
  borderRadius: 'medium',
})}
```

## API Routes

### GET `/api/market/[id]`

Returns market information for a specific market ID.

Response:
```json
{
  "id": "0",
  "creator": "0x...",
  "tokenAddress": "PEPE/USDT",
  "initialPrice": "1000000000000000000",
  "createdAt": "1234567890",
  "settlementTime": "1234567890",
  "settled": false,
  "finalPrice": "0"
}
```

### GET `/api/user-position?marketId=0&address=0x...`

Returns user's position for a specific market.

Response:
```json
{
  "marketId": "0",
  "tokenAddress": "PEPE/USDT",
  "upShares": "1000000000000000000",
  "downShares": "0",
  "settled": false,
  "initialPrice": "1000000000000000000",
  "finalPrice": "0"
}
```

## Troubleshooting

### Build Errors

If you encounter build errors with Tailwind CSS:
1. Delete `.next` folder: `rm -rf .next`
2. Clear node_modules and reinstall: `rm -rf node_modules && yarn install`
3. Ensure PostCSS config is correct

### Wallet Connection Issues

1. Make sure you have a valid WalletConnect Project ID
2. Check that your browser wallet extension is installed
3. Try clearing browser cache and reconnecting

### Transaction Failures

1. Ensure you have enough ETH for gas fees
2. Check that contract addresses are correct
3. Verify you're connected to the correct network

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For questions or issues, please open an issue on GitHub.

