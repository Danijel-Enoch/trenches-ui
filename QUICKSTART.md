# Quick Start Guide

## 1. Install Dependencies (Already Done ✅)

```bash
yarn install
```

## 2. Configure Your Project

### A. Get WalletConnect Project ID
1. Go to https://cloud.walletconnect.com/
2. Sign up or log in
3. Create a new project
4. Copy your Project ID

### B. Set Environment Variables

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# After deploying contracts, add these:
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=0x_deployed_market_contract
NEXT_PUBLIC_SHARE_TOKEN_ADDRESS=0x_deployed_share_token_contract
```

### C. Update Contract Addresses

Edit `lib/contracts.ts` (lines 1-2):

```typescript
export const PredictionMarket = "0x_your_deployed_contract_address"
export const shareToken = "0x_your_share_token_address"
```

## 3. Run Development Server

```bash
yarn dev
```

Open http://localhost:3000

## 4. Test the Application

### Without Contract (UI Only)
- ✅ View the UI
- ✅ Connect wallet
- ✅ Navigate between pages
- ❌ Create markets (needs contract)
- ❌ Trade (needs contract)

### With Contract (Full Functionality)
- ✅ Everything works!

## 5. Deploy Smart Contracts (If Not Done)

You need to deploy these contracts first:
1. `PredictionMarket.sol`
2. `ShareToken.sol`

After deployment:
1. Update addresses in `.env.local`
2. Update addresses in `lib/contracts.ts`
3. Restart dev server

## 6. Deploy to Production

### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Go to Project Settings > Environment Variables
```

### Option B: Other Hosting

```bash
# Build
yarn build

# Start
yarn start
```

## Troubleshooting

### "Cannot connect wallet"
- Make sure WalletConnect Project ID is set
- Check browser wallet extension is installed
- Try clearing browser cache

### "Transaction failed"
- Ensure you're on the correct network
- Check you have enough ETH for gas
- Verify contract addresses are correct

### "Build errors"
- Delete `.next` folder: `rm -rf .next`
- Reinstall: `rm -rf node_modules && yarn install`
- Run dev server instead of build for now

## File Structure Quick Reference

```
Key Files to Update:
├── .env.local                          # Environment variables
├── lib/contracts.ts                    # Contract addresses & ABIs
└── lib/wagmi.ts                        # Network configuration

UI Pages:
├── app/page.tsx                        # Markets list
├── app/create/page.tsx                 # Create market
└── app/positions/page.tsx              # User positions

Components:
├── components/navbar.tsx               # Navigation
└── components/market-card.tsx          # Market display & trading
```

## What's Next?

1. ✅ Install dependencies
2. ⏳ Get WalletConnect ID → Set in `.env.local`
3. ⏳ Deploy contracts → Update addresses
4. ⏳ Test on testnet
5. ⏳ Deploy to production

## Need Help?

- Check `README.md` for detailed documentation
- Check `SETUP_SUMMARY.md` for implementation details
- Review contract ABIs in `lib/contracts.ts`

## Testing Checklist

- [ ] Wallet connects successfully
- [ ] Can switch networks
- [ ] Can create a market
- [ ] Can view markets on home page
- [ ] Can buy UP/DOWN shares
- [ ] Can view positions
- [ ] Can sell shares
- [ ] Can claim winnings (after settlement)
- [ ] Animations work smoothly
- [ ] Responsive on mobile

Happy Building! 🚀
