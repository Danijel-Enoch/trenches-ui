# Subgraph Integration Guide

This project integrates with The Graph Protocol to provide efficient querying of on-chain events and data. The subgraph indexes smart contract events and makes them available through a GraphQL API.

## Overview

The integration includes:
- **MarketCreated events**: When new prediction markets are created
- **MarketSettled events**: When markets are resolved with final outcomes
- **FeesPaid events**: Fee payments to creators and platform

## Setup

### 1. Environment Configuration

Create a `.env.local` file and set your subgraph endpoint:

```bash
NEXT_PUBLIC_SUBGRAPH_URL=http://localhost:8000/subgraphs/name/trenches-graph
```

For production environments, use your deployed subgraph URL:
```bash
NEXT_PUBLIC_SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/your-org/trenches-graph
```

### 2. Dependencies

The following packages are required:
- `graphql-request`: GraphQL client for making queries
- `graphql`: GraphQL schema and query building

Install them with:
```bash
npm install graphql-request graphql
```

## Available Queries

### Market Created Events
```graphql
query GetMarketCreateds {
  marketCreateds(orderBy: blockTimestamp, orderDirection: desc) {
    transactionHash
    tokenAddress
    settlementTime
    marketId
    initialPrice
    id
    creator
    blockTimestamp
    blockNumber
  }
}
```

### Market Settled Events
```graphql
query GetMarketSettleds {
  marketSettleds(orderBy: blockTimestamp, orderDirection: desc) {
    marketId
    id
    finalPrice
    blockTimestamp
    blockNumber
    transactionHash
    winningOutcome
  }
}
```

### Fees Paid Events
```graphql
query GetFeesPaids {
  feesPaids(orderBy: blockTimestamp, orderDirection: desc) {
    creatorFee
    id
    marketId
    platformFee
    transactionHash
    creator
    blockTimestamp
    blockNumber
  }
}
```

## Usage

### React Hooks

The project provides custom React hooks for easy data fetching:

```typescript
import { useMarketCreateds, useMarketSettleds, useFeesPaids } from '@/lib/hooks';

function MyComponent() {
  const { data: markets, loading, error } = useMarketCreateds({
    first: 10,
    orderBy: 'blockTimestamp',
    orderDirection: 'desc'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {markets.map(market => (
        <div key={market.id}>Market #{market.marketId}</div>
      ))}
    </div>
  );
}
```

### Direct GraphQL Queries

You can also make direct GraphQL queries:

```typescript
import { getMarketCreateds, getMarketById } from '@/lib/graphql';

// Get all markets
const markets = await getMarketCreateds({
  first: 100,
  orderBy: 'blockTimestamp',
  orderDirection: 'desc'
});

// Get specific market data
const marketData = await getMarketById('123');
```

### API Routes

The project includes API routes that use the subgraph:

- `GET /api/markets` - Get all created markets
- `GET /api/markets/settled` - Get settled markets
- `GET /api/fees` - Get fee payment data
- `GET /api/market/[id]` - Get enhanced market data (combines contract + subgraph data)

## Components

### Subgraph Dashboard

Visit `/subgraph` to see a comprehensive dashboard displaying:
- Market statistics
- Recent market activity
- Settlement information
- Fee analytics

The dashboard automatically refreshes data every 30 seconds and includes:
- **MarketStats**: Overall platform statistics
- **RecentMarkets**: Latest market creations
- **SettledMarkets**: Recently resolved markets
- **FeesOverview**: Fee payment analytics

### Usage in Components

```typescript
import { SubgraphDashboard } from '@/components/subgraph-dashboard';

function AnalyticsPage() {
  return (
    <div>
      <h1>Platform Analytics</h1>
      <SubgraphDashboard />
    </div>
  );
}
```

## Real-time Updates

The hooks support auto-refresh functionality:

```typescript
const { data, loading, error } = useMarketCreateds({
  autoRefresh: true,
  refreshInterval: 30000, // 30 seconds
});
```

## Error Handling

All hooks and API functions include comprehensive error handling:

```typescript
const { data, loading, error, refetch } = useMarketCreateds();

if (error) {
  // Handle error state
  console.error('Failed to fetch markets:', error);
  // Optionally retry
  refetch();
}
```

## Performance Considerations

1. **Pagination**: Use `first` and `skip` parameters for large datasets
2. **Filtering**: Use GraphQL `where` clauses to reduce data transfer
3. **Caching**: The GraphQL client automatically caches responses
4. **Auto-refresh**: Use sparingly to avoid excessive API calls

## Development Tips

1. **Local Subgraph**: Start your local Graph node before running the app
2. **Query Testing**: Use GraphiQL at your subgraph endpoint to test queries
3. **Type Safety**: All GraphQL responses include TypeScript types
4. **Monitoring**: Check browser network tab for GraphQL query performance

## Troubleshooting

### Connection Issues
- Verify your `NEXT_PUBLIC_SUBGRAPH_URL` is correct
- Check if your subgraph is deployed and synced
- Ensure your local Graph node is running (if using local setup)

### Query Errors
- Validate your GraphQL query syntax
- Check if the queried fields exist in your subgraph schema
- Verify filter parameters match the schema types

### Performance Issues
- Reduce query `first` parameter if responses are slow
- Add appropriate `where` filters to limit results
- Consider implementing pagination for large datasets
