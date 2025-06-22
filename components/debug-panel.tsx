"use client"

import { useState } from 'react';
import { 
  Code, 
  Network, 
  Eye, 
  EyeOff, 
  Copy, 
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export type DebugLog = {
  id: string;
  timestamp: string;
  type: 'api' | 'network' | 'error';
  endpoint?: string;
  method?: string;
  request?: any;
  response?: any;
  error?: string;
};

export type DebugPanelProps = {
  logs: DebugLog[];
  isVisible: boolean;
  onToggle: () => void;
  onClear: () => void;
};

export default function DebugPanel({ logs, isVisible, onToggle, onClear }: DebugPanelProps) {
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [showNetworkLogs, setShowNetworkLogs] = useState(true);
  const [showApiLogs, setShowApiLogs] = useState(true);
  const [showErrors, setShowErrors] = useState(true);

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getLogIcon = (type: DebugLog['type']) => {
    switch (type) {
      case 'api':
        return <Code className="h-4 w-4 text-blue-500" />;
      case 'network':
        return <Network className="h-4 w-4 text-green-500" />;
      case 'error':
        return <Code className="h-4 w-4 text-red-500" />;
    }
  };

  const getLogColor = (type: DebugLog['type']) => {
    switch (type) {
      case 'api':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'network':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'error':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
    }
  };

  const filteredLogs = logs.filter(log => {
    if (log.type === 'api' && !showApiLogs) return false;
    if (log.type === 'network' && !showNetworkLogs) return false;
    if (log.type === 'error' && !showErrors) return false;
    return true;
  });

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center space-x-2">
          <Code className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Debug Panel</h3>
          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-xs rounded-full">
            {logs.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onClear}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Clear logs"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={onToggle}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Hide panel"
          >
            <EyeOff className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="flex space-x-2 text-xs">
          <label className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={showApiLogs}
              onChange={(e) => setShowApiLogs(e.target.checked)}
              className="rounded"
            />
            <span className="text-gray-600 dark:text-gray-300">API</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={showNetworkLogs}
              onChange={(e) => setShowNetworkLogs(e.target.checked)}
              className="rounded"
            />
            <span className="text-gray-600 dark:text-gray-300">Network</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={showErrors}
              onChange={(e) => setShowErrors(e.target.checked)}
              className="rounded"
            />
            <span className="text-gray-600 dark:text-gray-300">Errors</span>
          </label>
        </div>
      </div>

      {/* Logs */}
      <div className="max-h-64 overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            No logs to display
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`border-l-4 ${getLogColor(log.type)} p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    {getLogIcon(log.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {log.type.toUpperCase()}
                        </span>
                        {log.endpoint && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {log.method} {log.endpoint}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {log.timestamp}
                      </div>
                      {log.error && (
                        <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {log.error}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(log, null, 2))}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      title="Copy log"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => toggleLogExpansion(log.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      title="Toggle details"
                    >
                      {expandedLogs.has(log.id) ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>

                {expandedLogs.has(log.id) && (
                  <div className="mt-3 space-y-2">
                    {log.request && (
                      <div>
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Request:</div>
                        <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.request, null, 2)}
                        </pre>
                      </div>
                    )}
                    {log.response && (
                      <div>
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Response:</div>
                        <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.response, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 