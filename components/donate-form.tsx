"use client"

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useJupiter } from '@jup-ag/react-hook'
import { PublicKey } from '@solana/web3.js'
import { ChevronDown, RefreshCw } from 'lucide-react'
import JSBI from 'jsbi';
import { showQuoteFetched, showDonationSuccess, showInsufficientBalance } from '@/lib/toast'

// Define the tokens we want to allow for donation
const INPUT_TOKENS = [
  { symbol: 'SOL', mint: 'So11111111111111111111111111111111111111112', decimals: 9 },
  { symbol: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 },
  { symbol: 'USDT', mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', decimals: 6 },
]
const OUTPUT_TOKEN = { symbol: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 }

export default function DonateForm() {
  const { publicKey } = useWallet()
  const [amount, setAmount] = useState(0)
  const [inputToken, setInputToken] = useState(INPUT_TOKENS[0])
  
  const { quoteResponse, loading, refresh } = useJupiter({
    amount: JSBI.BigInt(amount * Math.pow(10, inputToken.decimals)),
    inputMint: new PublicKey(inputToken.mint),
    outputMint: new PublicKey(OUTPUT_TOKEN.mint),
    slippageBps: 50, // 0.5%
    debounceTime: 250,
  }) as any // Cast to any to bypass type errors

  // Show toast when quote is fetched
  useEffect(() => {
    if (quoteResponse && amount > 0) {
      const outputAmount = Number(quoteResponse.outAmount) / Math.pow(10, OUTPUT_TOKEN.decimals)
      showQuoteFetched(amount, inputToken.symbol, outputAmount)
    }
  }, [quoteResponse, amount, inputToken.symbol])

  const handleDonate = () => {
    if (!publicKey || !quoteResponse) {
      showInsufficientBalance()
      return
    }

    console.log('--- Mock Donation Transaction ---')
    console.log('User Wallet:', publicKey.toBase58())
    console.log('Donating:', amount, inputToken.symbol)
    console.log('Jupiter Quote:', quoteResponse)
    console.log('Route:', quoteResponse.routePlan.map((p: any) => p.swapInfo.label).join(' -> '))
    console.log('--- End Mock Transaction ---')

    // Show success notification
    const outputAmount = Number(quoteResponse.outAmount) / Math.pow(10, OUTPUT_TOKEN.decimals)
    showDonationSuccess(outputAmount)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 w-full max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Make a Donation
      </h2>
      
      <div className="flex items-end space-x-2 mb-4">
        {/* Amount Input */}
        <div className="flex-grow">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="0.00"
          />
        </div>

        {/* Token Dropdown */}
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Token
          </label>
          <div className="relative">
            <select
              id="token"
              value={inputToken.symbol}
              onChange={(e) => {
                const selectedToken = INPUT_TOKENS.find(t => t.symbol === e.target.value)
                if (selectedToken) setInputToken(selectedToken)
              }}
              className="appearance-none w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {INPUT_TOKENS.map(token => (
                <option key={token.symbol}>{token.symbol}</option>
              ))}
            </select>
            <ChevronDown className="h-5 w-5 text-gray-400 absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Jupiter Swap Preview */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6 text-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 dark:text-gray-400">You will receive (approx.)</span>
          <button onClick={refresh} disabled={loading} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <RefreshCw className={`h-4 w-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {loading ? '...' : (quoteResponse ? (Number(quoteResponse.outAmount) / Math.pow(10, OUTPUT_TOKEN.decimals)).toFixed(2) : '0.00')} USDC
        </div>
        {quoteResponse && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Route: {quoteResponse.routePlan.map((p: any) => p.swapInfo.label).join(' -> ')}
          </div>
        )}
      </div>

      {/* Donate Button */}
      <button
        onClick={handleDonate}
        disabled={!publicKey || !quoteResponse || loading}
        className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {!publicKey ? 'Connect Wallet to Donate' : 'Donate Now'}
      </button>
    </div>
  )
} 