"use client"

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function WalletConnectButton() {
  const { publicKey, connected } = useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex items-center">
        <div className="flex items-center space-x-2">
          <Wallet className="h-5 w-5 text-gray-400" />
          <div className="bg-primary-600 hover:bg-primary-700 text-white border-0 rounded-lg px-4 py-2 text-sm font-medium">
            Connect Wallet
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center">
      {connected ? (
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              {shortenAddress(publicKey?.toString() || '')}
            </span>
          </div>
          <WalletMultiButton className="!bg-gray-100 !text-gray-700 hover:!bg-gray-200 dark:!bg-gray-700 dark:!text-gray-300 dark:hover:!bg-gray-600 !border-0 !rounded-lg !px-3 !py-2 !text-sm !font-medium" />
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Wallet className="h-5 w-5 text-gray-400" />
          <WalletMultiButton className="!bg-primary-600 hover:!bg-primary-700 !text-white !border-0 !rounded-lg !px-4 !py-2 !text-sm !font-medium" />
        </div>
      )}
    </div>
  )
} 