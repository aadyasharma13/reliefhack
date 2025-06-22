import { transactionFeed } from './mock-data';
import { Clock } from 'lucide-react';

export default function TransactionFeed() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Donations
      </h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {transactionFeed.map((tx, index) => (
          <li key={index} className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                  {tx.token.slice(0, 1)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {tx.amount} {tx.token}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  From {tx.donor}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                ${tx.usdValue.toLocaleString()}
              </p>
              <p className="flex items-center justify-end text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                {tx.timestamp}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 