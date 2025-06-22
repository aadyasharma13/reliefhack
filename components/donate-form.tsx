"use client"

import { useEffect, useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, VersionedTransaction } from '@solana/web3.js'
import { ChevronDown, RefreshCw } from 'lucide-react'
import { showQuoteFetched, showDonationSuccess, showInsufficientBalance, showError } from '@/lib/toast'

// Define the tokens we want to allow for donation
const INPUT_TOKENS = [
  { symbol: 'SOL', mint: 'So11111111111111111111111111111111111111112', decimals: 9 },
  { symbol: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 },
  { symbol: 'USDT', mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', decimals: 6 },
]
const OUTPUT_TOKEN = { symbol: 'USDC', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 }

export default function DonateForm() {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [amount, setAmount] = useState(0)
  const [inputToken, setInputToken] = useState(INPUT_TOKENS[0])
  const [quoteResponse, setQuoteResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [quoteLoading, setQuoteLoading] = useState(false)

  // Fetch quote from our backend API
  const fetchQuote = async () => {
    if (!amount || amount <= 0) {
      setQuoteResponse(null)
      return
    }

    setQuoteLoading(true)
    try {
      const amountInSmallestUnit = Math.floor(amount * Math.pow(10, inputToken.decimals))
      const response = await fetch(`/api/quote?inputMint=${inputToken.mint}&outputMint=${OUTPUT_TOKEN.mint}&amount=${amountInSmallestUnit}&slippage=50`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch quote')
      }

      const data = await response.json()
      if (data.success) {
        setQuoteResponse(data.data)
        const outputAmount = Number(data.data.outAmount) / Math.pow(10, OUTPUT_TOKEN.decimals)
        showQuoteFetched(amount, inputToken.symbol, outputAmount)
      } else {
        throw new Error(data.error || 'Failed to fetch quote')
      }
    } catch (error) {
      console.error('Quote fetch error:', error)
      showError('Failed to fetch quote. Please try again.')
      setQuoteResponse(null)
    } finally {
      setQuoteLoading(false)
    }
  }

  // Fetch quote when amount or token changes
  useEffect(() => {
    const timeoutId = setTimeout(fetchQuote, 500) // Debounce
    return () => clearTimeout(timeoutId)
  }, [amount, inputToken])

  const handleDonate = async () => {
    if (!publicKey || !quoteResponse) {
      showInsufficientBalance()
      return
    }

    setLoading(true)
    try {
      const treasuryWallet = process.env.NEXT_PUBLIC_TREASURY_WALLET_ADDRESS;
      if (!treasuryWallet) {
        throw new Error('Treasury wallet address is not configured. Please set NEXT_PUBLIC_TREASURY_WALLET_ADDRESS in your .env.local file.');
      }

      // Call our swap API to get the transaction
      const response = await fetch('/api/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: publicKey.toBase58(),
          destinationWallet: treasuryWallet, // Send directly to the treasury
          asLegacyTransaction: true, // Request a legacy transaction for wallet adapter
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get swap transaction')
      }

      const { data } = await response.json()
      const { swapTransaction } = data;

      // Deserialize the transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      
      // Sign and send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Confirm the transaction
      await connection.confirmTransaction(signature, 'confirmed');

      console.log('Donation successful, signature:', signature)
      const outputAmount = Number(quoteResponse.outAmount) / Math.pow(10, OUTPUT_TOKEN.decimals)
      showDonationSuccess(outputAmount)
      
      // Reset form
      setAmount(0)
      setQuoteResponse(null)
    } catch (error) {
      console.error('Donation error:', error)
      showError('Failed to process donation. Please try again.')
    } finally {
      setLoading(false)
    }
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
          <button onClick={fetchQuote} disabled={quoteLoading} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <RefreshCw className={`h-4 w-4 text-gray-500 ${quoteLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {quoteLoading ? '...' : (quoteResponse ? (Number(quoteResponse.outAmount) / Math.pow(10, OUTPUT_TOKEN.decimals)).toFixed(2) : '0.00')} USDC
        </div>
        {quoteResponse && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Route: {quoteResponse.routePlan?.map((p: any) => p.swapInfo.label).join(' -> ') || 'Direct swap'}
          </div>
        )}
      </div>

      {/* Donate Button */}
      <button
        onClick={handleDonate}
        disabled={!publicKey || !quoteResponse || loading || quoteLoading}
        className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {!publicKey ? 'Connect Wallet to Donate' : 
         loading ? 'Processing...' : 
         quoteLoading ? 'Fetching Quote...' : 
         'Donate Now'}
      </button>
    </div>
  )
} 