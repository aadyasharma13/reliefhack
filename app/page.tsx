"use client"

import Layout from '@/components/layout'

export default function Home() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to ReliefDAO
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            A decentralized disaster relief platform powered by Solana blockchain, enabling instant, 
            transparent, and borderless humanitarian aid through crypto donations and automated smart contracts.
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Connected to Solana Devnet</span>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-primary-600 dark:text-primary-400 text-xl">💝</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Crypto Donations
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Donate any cryptocurrency and instantly convert to USDC via Jupiter DEX for immediate relief distribution.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 dark:text-green-400 text-xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Instant Payouts
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Automated smart contracts trigger instant payouts to local coordinators when disaster events are detected.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 dark:text-blue-400 text-xl">🔗</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Transparent Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              All donations and distributions are recorded on-chain for complete transparency and auditability.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
} 