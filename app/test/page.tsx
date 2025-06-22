"use client"

import { useState } from 'react'
import Layout from '@/components/layout'

export default function TestPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState<string | null>(null)

  const testAPI = async (endpoint: string, method: string = 'GET', body?: any) => {
    setLoading(endpoint)
    try {
      const response = await fetch(endpoint, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })
      
      const data = await response.json()
      setResults(prev => ({
        ...prev,
        [endpoint]: { success: response.ok, data, status: response.status }
      }))
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [endpoint]: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }))
    } finally {
      setLoading(null)
    }
  }

  const testAllAPIs = async () => {
    // Test Quote API
    await testAPI('/api/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000000')
    
    // Test Treasury Balance API
    await testAPI('/api/treasury/balance')
    
    // Test Manual Trigger API (GET)
    await testAPI('/api/trigger/manual')
    
    // Test Manual Trigger API (POST)
    await testAPI('/api/trigger/manual', 'POST', {
      disasterType: 'earthquake',
      location: 'Test Location',
      severity: 'Medium',
      description: 'Test disaster event',
      estimatedDamage: 500000,
      affectedPopulation: 25000,
    })
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            API Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test all backend APIs to ensure they're working correctly
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={testAllAPIs}
            disabled={loading !== null}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test All APIs'}
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(results).map(([endpoint, result]: [string, any]) => (
            <div
              key={endpoint}
              className={`p-4 rounded-lg border ${
                result.success 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
              }`}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {endpoint}
              </h3>
              <div className="text-sm">
                <p className="mb-1">
                  <span className="font-medium">Status:</span> {result.success ? '✅ Success' : '❌ Failed'}
                </p>
                {result.status && (
                  <p className="mb-1">
                    <span className="font-medium">HTTP Status:</span> {result.status}
                  </p>
                )}
                <p className="mb-2">
                  <span className="font-medium">Response:</span>
                </p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(result.data || result.error, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {Object.keys(results).length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Click "Test All APIs" to start testing
          </div>
        )}
      </div>
    </Layout>
  )
} 