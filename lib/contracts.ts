export const PredictionMarket = "0x0000000000000000000000000000000000000000" // Replace with actual contract address
export const shareToken = "0x0000000000000000000000000000000000000000" // Replace with actual contract address

export const PredictionMarketAbi = [
    { "type": "constructor", "inputs": [], "stateMutability": "nonpayable" },
    {
      "type": "function",
      "name": "CREATOR_FEE",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "CREATOR_INITIAL_SHARES",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "FEE_DENOMINATOR",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "TRADER_SHARE_REWARD",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "TRADING_FEE_CREATOR",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "TRADING_FEE_PLATFORM",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "WINNER_SHARE_MULTIPLIER",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "authorizeBot",
      "inputs": [
        { "name": "_bot", "type": "address", "internalType": "address" },
        { "name": "_authorized", "type": "bool", "internalType": "bool" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "authorizedBots",
      "inputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "batchSettleMarkets",
      "inputs": [
        {
          "name": "_marketIds",
          "type": "uint256[]",
          "internalType": "uint256[]"
        },
        {
          "name": "_finalPrices",
          "type": "uint256[]",
          "internalType": "uint256[]"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "buyShares",
      "inputs": [
        { "name": "_marketId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_outcome",
          "type": "uint8",
          "internalType": "enum PredictionMarket.Outcome"
        },
        { "name": "_shares", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "calculateBuyCost",
      "inputs": [
        { "name": "_marketId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_outcome",
          "type": "uint8",
          "internalType": "enum PredictionMarket.Outcome"
        },
        { "name": "_shares", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "calculateSellPayout",
      "inputs": [
        { "name": "_marketId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_outcome",
          "type": "uint8",
          "internalType": "enum PredictionMarket.Outcome"
        },
        { "name": "_shares", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "claimProtocolTokens",
      "inputs": [
        { "name": "_shareAmount", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "claimWinnings",
      "inputs": [
        { "name": "_marketId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "createMarket",
      "inputs": [
        { "name": "_tokenAddress", "type": "string", "internalType": "string" },
        {
          "name": "_initialPrice",
          "type": "uint256",
          "internalType": "uint256"
        }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "depositProtocolTokens",
      "inputs": [
        { "name": "_amount", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getMarketInfo",
      "inputs": [
        { "name": "_marketId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "creator", "type": "address", "internalType": "address" },
        { "name": "tokenAddress", "type": "string", "internalType": "string" },
        {
          "name": "initialPrice",
          "type": "uint256",
          "internalType": "uint256"
        },
        { "name": "createdAt", "type": "uint256", "internalType": "uint256" },
        {
          "name": "settlementTime",
          "type": "uint256",
          "internalType": "uint256"
        },
        { "name": "settled", "type": "bool", "internalType": "bool" },
        { "name": "finalPrice", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getOutcomeStats",
      "inputs": [
        { "name": "_marketId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_outcome",
          "type": "uint8",
          "internalType": "enum PredictionMarket.Outcome"
        }
      ],
      "outputs": [
        { "name": "totalShares", "type": "uint256", "internalType": "uint256" },
        { "name": "totalVolume", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getPositionToken",
      "inputs": [
        { "name": "_marketId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_outcome",
          "type": "uint8",
          "internalType": "enum PredictionMarket.Outcome"
        }
      ],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getProtocolTokenAddress",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getProtocolTokenInfo",
      "inputs": [],
      "outputs": [
        { "name": "balance", "type": "uint256", "internalType": "uint256" },
        { "name": "totalShares", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getShareTokenAddress",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getUnsettledMarkets",
      "inputs": [
        {
          "name": "_marketIds",
          "type": "uint256[]",
          "internalType": "uint256[]"
        }
      ],
      "outputs": [
        { "name": "", "type": "uint256[]", "internalType": "uint256[]" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getUserShareBalance",
      "inputs": [
        { "name": "_user", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getUserShares",
      "inputs": [
        { "name": "_marketId", "type": "uint256", "internalType": "uint256" },
        { "name": "_user", "type": "address", "internalType": "address" },
        {
          "name": "_outcome",
          "type": "uint8",
          "internalType": "enum PredictionMarket.Outcome"
        }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "isAuthorizedBot",
      "inputs": [
        { "name": "_bot", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "markets",
      "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "outputs": [
        { "name": "creator", "type": "address", "internalType": "address" },
        { "name": "tokenAddress", "type": "string", "internalType": "string" },
        {
          "name": "initialPrice",
          "type": "uint256",
          "internalType": "uint256"
        },
        { "name": "createdAt", "type": "uint256", "internalType": "uint256" },
        {
          "name": "settlementTime",
          "type": "uint256",
          "internalType": "uint256"
        },
        { "name": "settled", "type": "bool", "internalType": "bool" },
        {
          "name": "winningOutcome",
          "type": "uint8",
          "internalType": "enum PredictionMarket.Outcome"
        },
        { "name": "finalPrice", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "nextMarketId",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "platformOwner",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "protocolToken",
      "inputs": [],
      "outputs": [
        { "name": "", "type": "address", "internalType": "contract IERC20" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "protocolTokenBalance",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "sellShares",
      "inputs": [
        { "name": "_marketId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_outcome",
          "type": "uint8",
          "internalType": "enum PredictionMarket.Outcome"
        },
        { "name": "_shares", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setProtocolToken",
      "inputs": [
        {
          "name": "_protocolToken",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "settleMarket",
      "inputs": [
        { "name": "_marketId", "type": "uint256", "internalType": "uint256" },
        { "name": "_finalPrice", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "shareToken",
      "inputs": [],
      "outputs": [
        { "name": "", "type": "address", "internalType": "contract ShareToken" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "totalSharesIssued",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "BatchSettlement",
      "inputs": [
        {
          "name": "marketIds",
          "type": "uint256[]",
          "indexed": false,
          "internalType": "uint256[]"
        },
        {
          "name": "successCount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "BotAuthorized",
      "inputs": [
        {
          "name": "bot",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "authorized",
          "type": "bool",
          "indexed": false,
          "internalType": "bool"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "FeesPaid",
      "inputs": [
        {
          "name": "marketId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "creator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "creatorFee",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "platformFee",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "MarketCreated",
      "inputs": [
        {
          "name": "marketId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "creator",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "tokenAddress",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        },
        {
          "name": "initialPrice",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "settlementTime",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "MarketSettled",
      "inputs": [
        {
          "name": "marketId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "winningOutcome",
          "type": "uint8",
          "indexed": false,
          "internalType": "enum PredictionMarket.Outcome"
        },
        {
          "name": "finalPrice",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ProtocolTokenClaimed",
      "inputs": [
        {
          "name": "user",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "shareTokensBurned",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "protocolTokensReceived",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ProtocolTokenDeposited",
      "inputs": [
        {
          "name": "amount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ShareTokensEarned",
      "inputs": [
        {
          "name": "user",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "reason",
          "type": "string",
          "indexed": false,
          "internalType": "string"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "SharesPurchased",
      "inputs": [
        {
          "name": "marketId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "buyer",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "outcome",
          "type": "uint8",
          "indexed": false,
          "internalType": "enum PredictionMarket.Outcome"
        },
        {
          "name": "shares",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "cost",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "SharesSold",
      "inputs": [
        {
          "name": "marketId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "seller",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "outcome",
          "type": "uint8",
          "indexed": false,
          "internalType": "enum PredictionMarket.Outcome"
        },
        {
          "name": "shares",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "payout",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "WinningsClaimed",
      "inputs": [
        {
          "name": "marketId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "winner",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    }
  ] as const;

export const shareTokenAbi = [
    {
      "type": "constructor",
      "inputs": [
        { "name": "_owner", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "allowance",
      "inputs": [
        { "name": "owner", "type": "address", "internalType": "address" },
        { "name": "spender", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "approve",
      "inputs": [
        { "name": "spender", "type": "address", "internalType": "address" },
        { "name": "value", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "balanceOf",
      "inputs": [
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "burn",
      "inputs": [
        { "name": "from", "type": "address", "internalType": "address" },
        { "name": "amount", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "decimals",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint8", "internalType": "uint8" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "mint",
      "inputs": [
        { "name": "to", "type": "address", "internalType": "address" },
        { "name": "amount", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "name",
      "inputs": [],
      "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "renounceOwnership",
      "inputs": [],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "symbol",
      "inputs": [],
      "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "totalSupply",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "transfer",
      "inputs": [
        { "name": "to", "type": "address", "internalType": "address" },
        { "name": "value", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferFrom",
      "inputs": [
        { "name": "from", "type": "address", "internalType": "address" },
        { "name": "to", "type": "address", "internalType": "address" },
        { "name": "value", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "inputs": [
        { "name": "newOwner", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "Approval",
      "inputs": [
        {
          "name": "owner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "spender",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "value",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
        {
          "name": "previousOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "newOwner",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Transfer",
      "inputs": [
        {
          "name": "from",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "to",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "value",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "ERC20InsufficientAllowance",
      "inputs": [
        { "name": "spender", "type": "address", "internalType": "address" },
        { "name": "allowance", "type": "uint256", "internalType": "uint256" },
        { "name": "needed", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "ERC20InsufficientBalance",
      "inputs": [
        { "name": "sender", "type": "address", "internalType": "address" },
        { "name": "balance", "type": "uint256", "internalType": "uint256" },
        { "name": "needed", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "ERC20InvalidApprover",
      "inputs": [
        { "name": "approver", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "ERC20InvalidReceiver",
      "inputs": [
        { "name": "receiver", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "ERC20InvalidSender",
      "inputs": [
        { "name": "sender", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "ERC20InvalidSpender",
      "inputs": [
        { "name": "spender", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "OwnableInvalidOwner",
      "inputs": [
        { "name": "owner", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "OwnableUnauthorizedAccount",
      "inputs": [
        { "name": "account", "type": "address", "internalType": "address" }
      ]
    }
  ] as const;