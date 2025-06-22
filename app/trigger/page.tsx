"use client"

import { useState } from 'react';
import Layout from '@/components/layout';
import { ChevronDown, Zap, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { showTriggerStarted, showTriggerCompleted, showError } from '@/lib/toast';
import PayoutLog, { PayoutEntry } from '@/components/payout-log';

// Mock wallet addresses for payouts
const mockWallets = [
  { address: '7mK9tA2...', name: 'Florida Relief Fund', amount: 25000 },
  { address: 'E5f9Bq...', name: 'Emergency Response Team', amount: 15000 },
  { address: 'Bqd8X9z...', name: 'Local Aid Organization', amount: 10000 },
];

// Disaster types
const disasterTypes = [
  { value: 'hurricane', label: 'Hurricane', description: 'Tropical storms and hurricanes' },
  { value: 'earthquake', label: 'Earthquake', description: 'Seismic events and tremors' },
  { value: 'flood', label: 'Flood', description: 'Flooding and water damage' },
  { value: 'wildfire', label: 'Wildfire', description: 'Forest fires and brush fires' },
  { value: 'tornado', label: 'Tornado', description: 'Tornadoes and severe storms' },
];

export default function TriggerPage() {
  const [selectedDisaster, setSelectedDisaster] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const [payouts, setPayouts] = useState<Array<{
    wallet: string;
    amount: number;
    timestamp: string;
    status: 'pending' | 'completed';
  }>>([]);
  const [payoutLogData, setPayoutLogData] = useState<{
    eventSummary: string;
    payouts: PayoutEntry[];
    eventTimestamp: string;
  } | null>(null);

  const handleTrigger = async () => {
    if (!selectedDisaster) return;
    
    setIsTriggering(true);
    showTriggerStarted();
    
    try {
      // Call our manual trigger API
      const response = await fetch('/api/trigger/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disasterType: selectedDisaster,
          location: 'Demo Location',
          severity: 'High',
          description: `Manual trigger for ${selectedDisaster} disaster`,
          estimatedDamage: 1000000,
          affectedPopulation: 50000,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to trigger disaster event');
      }

      const data = await response.json();
      if (data.success) {
        console.log('Disaster triggered:', data.data);
        
        // Simulate payout process
        const newPayouts = mockWallets.map((wallet, index) => ({
          wallet: wallet.address,
          amount: wallet.amount,
          timestamp: new Date().toLocaleTimeString(),
          status: 'pending' as const,
        }));
        
        setPayouts(newPayouts);
        
        // Simulate processing time and complete payouts
        setTimeout(() => {
          setPayouts(prev => prev.map(payout => ({ ...payout, status: 'completed' as const })));
          setIsTriggering(false);
          showTriggerCompleted();
          
          // Create payout log data
          const disasterName = disasterTypes.find(d => d.value === selectedDisaster)?.label || selectedDisaster;
          const payoutEntries: PayoutEntry[] = mockWallets.map((wallet, index) => ({
            recipient: wallet.address,
            amount: wallet.amount,
            txId: `tx-${data.data.disasterEvent.id}-${index}`, // Use real disaster event ID
            timestamp: new Date().toLocaleTimeString(),
          }));
          
          setPayoutLogData({
            eventSummary: `${disasterName} Disaster Event Triggered`,
            payouts: payoutEntries,
            eventTimestamp: new Date().toLocaleString(),
          });
        }, 3000);
      } else {
        throw new Error(data.error || 'Failed to trigger disaster event');
      }
    } catch (error) {
      console.error('Trigger error:', error);
      showError('Failed to trigger disaster event. Please try again.');
      setIsTriggering(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Trigger Disaster Relief
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Automatically distribute funds to relief organizations when disaster conditions are met
          </p>
        </div>

        {/* Disaster Type Selection */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Select Disaster Type
          </h2>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-left"
            >
              <span className={selectedDisaster ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                {selectedDisaster 
                  ? disasterTypes.find(d => d.value === selectedDisaster)?.label 
                  : 'Choose disaster type...'
                }
              </span>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
                {disasterTypes.map((disaster) => (
                  <button
                    key={disaster.value}
                    onClick={() => {
                      setSelectedDisaster(disaster.value);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{disaster.label}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{disaster.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Trigger Button */}
        <div className="text-center">
          <button
            onClick={handleTrigger}
            disabled={!selectedDisaster || isTriggering}
            className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            <Zap className="h-5 w-5 mr-2" />
            {isTriggering ? 'Processing Payouts...' : 'Trigger Payouts'}
          </button>
        </div>

        {/* Payout Status */}
        {payouts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Payout Status
            </h2>
            
            <div className="space-y-4">
              {payouts.map((payout, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg transition-all duration-500 ${
                    payout.status === 'completed'
                      ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                      : 'border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {payout.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {payout.wallet}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {payout.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {payout.amount.toLocaleString()} USDC
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            How it works
          </h3>
          <p className="text-blue-800 dark:text-blue-200">
            When disaster conditions are met, ReliefDAO automatically triggers payouts to pre-approved 
            relief organizations. Funds are distributed instantly using smart contracts, ensuring 
            rapid response to emergencies.
          </p>
        </div>

        {/* Payout Log */}
        {payoutLogData && (
          <PayoutLog {...payoutLogData} />
        )}
      </div>
    </Layout>
  );
} 