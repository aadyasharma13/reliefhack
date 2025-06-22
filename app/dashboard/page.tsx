"use client"

import { useEffect, useState } from 'react'
import Layout from '@/components/layout';
import TokenDistributionChart from '@/components/dashboard/token-distribution-chart';
import TransactionFeed from '@/components/dashboard/transaction-feed';
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

// StatCard component (kept in the same file for simplicity)
const StatCard = ({ stat }: { stat: any }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
      <stat.icon className="h-5 w-5 text-gray-400" />
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
    <div className={`mt-2 flex items-center text-xs ${stat.changeType === 'increase' ? 'text-green-500' : stat.changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'}`}>
      {stat.changeType === 'increase' && <ArrowUpRight className="h-3 w-3 mr-1" />}
      {stat.changeType === 'decrease' && <ArrowDownRight className="h-3 w-3 mr-1" />}
      <span>{stat.change}</span>
    </div>
  </div>
);

// EventCard component (kept in the same file for simplicity)
const EventCard = ({ event }: { event: any }) => {
  const progress = (event.raised / event.goal) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{event.name}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{event.location}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{event.cause}</p>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
        <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300">${event.raised.toLocaleString()} raised</span>
        <span className="text-gray-500 dark:text-gray-400">Goal: ${event.goal.toLocaleString()}</span>
      </div>

      <button className="w-full mt-4 bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
        Donate to this Event
      </button>
    </div>
  );
};

export default function DashboardPage() {
  const [treasuryData, setTreasuryData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch treasury data
  const fetchTreasuryData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/treasury/balance')
      if (!response.ok) {
        throw new Error('Failed to fetch treasury data')
      }
      
      const data = await response.json()
      if (data.success) {
        setTreasuryData(data.data)
      } else {
        throw new Error(data.error || 'Failed to fetch treasury data')
      }
    } catch (err) {
      console.error('Treasury data fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch treasury data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTreasuryData()
  }, [])

  // Generate stats from real data
  const generateStats = () => {
    if (!treasuryData) return []

    return [
      {
        title: 'Total Treasury Balance',
        value: `$${(treasuryData.balances.usdc + treasuryData.balances.sol * 100).toLocaleString()}`,
        change: '+12.5%',
        changeType: 'increase' as const,
        icon: ArrowUpRight,
      },
      {
        title: 'USDC Balance',
        value: `$${treasuryData.balances.usdc.toLocaleString()}`,
        change: '+8.2%',
        changeType: 'increase' as const,
        icon: ArrowUpRight,
      },
      {
        title: 'SOL Balance',
        value: `${treasuryData.balances.sol.toFixed(4)} SOL`,
        change: '+15.3%',
        changeType: 'increase' as const,
        icon: ArrowUpRight,
      },
      {
        title: 'Recent Transactions',
        value: treasuryData.recentTransactions?.length || 0,
        change: 'Last 24h',
        changeType: 'neutral' as const,
        icon: ArrowUpRight,
      },
    ]
  }

  // Mock active events (you can replace this with real API data later)
  const activeEvents = [
    {
      name: 'Hurricane Relief Fund',
      location: 'Miami, FL',
      cause: 'Emergency relief for hurricane victims',
      raised: treasuryData?.balances.usdc * 0.3 || 15000,
      goal: 50000,
    },
    {
      name: 'Earthquake Recovery',
      location: 'San Francisco, CA',
      cause: 'Rebuilding efforts after recent earthquake',
      raised: treasuryData?.balances.usdc * 0.2 || 10000,
      goal: 75000,
    },
  ]

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading treasury data...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchTreasuryData}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const stats = generateStats()

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Real-time overview of donation activities and relief efforts.
            </p>
          </div>
          <button 
            onClick={fetchTreasuryData}
            disabled={loading}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <RefreshCw className={`h-5 w-5 text-gray-600 dark:text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.title} stat={stat} />
          ))}
        </div>

        {/* Main Dashboard Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Active Donation Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeEvents.map((event) => (
                  <EventCard key={event.name} event={event} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <TokenDistributionChart />
          </div>
        </div>

        {/* Transaction Feed below main area */}
        <div>
            <TransactionFeed />
        </div>
      </div>
    </Layout>
  );
} 