# Token Search Functionality

## Overview
The application now supports token search functionality for creating prediction markets. Users can only search using token contract addresses, and the system fetches comprehensive token details including price, market cap, liquidity, logo, and supported chains.

## How It Works

### 1. Token Address Validation
- Only valid Ethereum-style addresses (0x followed by 40 hexadecimal characters) are accepted
- Symbol-based searches are not supported to ensure accuracy

### 2. Search API (`/api/search`)
**Endpoint:** `GET /api/search?q={tokenAddress}`

**Request Parameters:**
- `q` (required): Token contract address (e.g., `0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed`)
- `chains` (optional): Comma-separated list of chains (defaults to ethereum,bsc,solana,base)

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "address": "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
      "symbol": "DEGEN",
      "name": "Degen",
      "price": "0.001864",
      "marketCap": "68918798",
      "liquidity": "764109.62",
      "logo": "https://...",
      "chains": ["base"],
      "priceFormatted": "1864000000000000"
    }
  ],
  "query": "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
  "chains": ["ethereum", "bsc", "solana", "base"],
  "resultsCount": 1
}
```

### 3. Price Formatting
- The `price` field contains the human-readable USD price
- The `priceFormatted` field contains the price converted to 18 decimal places (wei) for smart contract use
- Conversion formula: `price * 10^18`

### 4. Smart Contract Integration
- The formatted price is passed directly to the `createMarket` function
- Contract expects: `createMarket(tokenAddress: string, initialPrice: uint256)`
- The `initialPrice` parameter uses the `priceFormatted` value

## User Flow

1. **Enter Token Address**: User pastes a token contract address
2. **Search**: Click "Search" to fetch token details
3. **Review Details**: System displays:
   - Token name, symbol, and logo
   - Current USD price
   - Market capitalization
   - Available liquidity
   - Supported chains
4. **Create Market**: If satisfied, user can create the prediction market
5. **Smart Contract Call**: Price is automatically formatted and sent to contract

## Supported Features

### Token Details Retrieved:
- ✅ Token address
- ✅ Price (USD)
- ✅ Market capitalization
- ✅ Liquidity
- ✅ Logo/image
- ✅ Supported chains
- ✅ Price formatted for smart contracts (18 decimals)

### Data Sources:
- DexScreener API
- GeckoTerminal API
- Filtered to Base chain and supported DEXes only

### Validation:
- ✅ Address format validation
- ✅ Token existence verification
- ✅ Error handling for API failures
- ✅ Empty results handling

## Example Usage

```bash
# Valid search
curl "http://localhost:3001/api/search?q=0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed"

# Invalid address
curl "http://localhost:3001/api/search?q=invalidaddress"
# Returns: {"error":"Only token addresses are allowed..."}

# Non-existent token
curl "http://localhost:3001/api/search?q=0x1234567890123456789012345678901234567890"
# Returns: {"success":true,"data":[],...}
```

## UI Features

- **Real-time validation**: Address format is validated as user types
- **Search button**: Triggers token lookup
- **Token preview**: Shows comprehensive token information
- **Error handling**: Clear error messages for various scenarios
- **Create button**: Dynamically updates based on search state

## Technical Implementation

### Files Modified:
- `/app/api/search/route.ts` - Enhanced with address validation and price formatting
- `/app/create/page.tsx` - Added search UI and token details display
- `/lib/types.ts` - Added TokenDetails interface
- `/lib/utils.ts` - Added price formatting and address validation utilities

### Key Functions:
- `formatPriceForContract(priceUsd: string)` - Converts USD price to 18-decimal wei format
- `isValidAddress(address: string)` - Validates Ethereum address format
- Token search and display logic in create page component
