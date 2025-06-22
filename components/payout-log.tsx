"use client"

import { ExternalLink, User, DollarSign, Clock } from 'lucide-react';

export type PayoutEntry = {
  recipient: string;
  amount: number;
  txId: string;
  timestamp: string;
};

export type PayoutLogProps = {
  eventSummary: string;
  payouts: PayoutEntry[];
  eventTimestamp: string;
};

export default function PayoutLog({ eventSummary, payouts, eventTimestamp }: PayoutLogProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 w-full max-w-2xl mx-auto mt-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 flex items-center">
          <DollarSign className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
          {eventSummary}
        </h2>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-1" />
          <span>{eventTimestamp}</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recipient</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount (USDC)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {payouts.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No payouts yet. Trigger a disaster event to distribute funds.
                </td>
              </tr>
            ) : (
              payouts.map((payout, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-mono text-sm text-gray-900 dark:text-white">
                      {payout.recipient.slice(0, 4)}...{payout.recipient.slice(-4)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-white font-semibold">
                    {payout.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2">
                    <a
                      href={`https://explorer.solana.com/tx/${payout.txId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      View on Explorer
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </td>
                  <td className="px-4 py-2 text-gray-500 dark:text-gray-400 text-xs">
                    {payout.timestamp}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 