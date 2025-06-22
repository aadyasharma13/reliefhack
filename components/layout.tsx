"use client"

import { useState } from 'react'
import { 
  Menu, 
  X,
  Heart, 
  BarChart3, 
  Bell, 
  Settings,
  Sun,
  Moon,
  Monitor,
  LayoutGrid,
  HeartHandshake,
  Zap,
  Users,
  AlertTriangle,
  Code
} from 'lucide-react'
import { useTheme } from './theme-provider'
import WalletConnectButton from './wallet-connect-button'
import ClientOnly from './client-only'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DebugPanel, { DebugLog } from './debug-panel'

interface LayoutProps {
  children: React.ReactNode
}

// Nav Links
const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/donate', label: 'Donate', icon: HeartHandshake },
  { href: '/trigger', label: 'Trigger', icon: AlertTriangle },
  { href: '/events', label: 'Events', icon: Zap },
  { href: '/community', label: 'Community', icon: Users },
];

type SidebarNavLinkProps = {
  href: string;
  label: string;
  icon: React.ElementType;
  isMobile?: boolean;
  closeSheet?: () => void;
};

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [debugPanelVisible, setDebugPanelVisible] = useState(false)
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'api',
      endpoint: '/api/quote',
      method: 'POST',
      request: { amount: 1, inputToken: 'SOL', outputToken: 'USDC' },
      response: { outAmount: 24500000, route: ['Raydium', 'Orca'] }
    },
    {
      id: '2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'network',
      endpoint: 'https://api.jup.ag/v4/quote',
      method: 'GET',
      request: { inputMint: 'So11111111111111111111111111111111111111112', outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
      response: { data: { outAmount: 24500000 } }
    }
  ])

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />
      case 'dark':
        return <Moon className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                ReliefDAO
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navLinks.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="nav-item text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </a>
              )
            })}
          </nav>
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Theme
              </span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={`Current theme: ${theme}`}
              >
                {getThemeIcon()}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="ml-4 lg:ml-0 text-lg font-semibold text-gray-900 dark:text-white">
                Decentralized Disaster Relief
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDebugPanelVisible(!debugPanelVisible)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Toggle Debug Panel"
              >
                <Code className="h-5 w-5" />
              </button>
              <ClientOnly
                fallback={
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 text-gray-400"></div>
                    <div className="bg-primary-600 hover:bg-primary-700 text-white border-0 rounded-lg px-4 py-2 text-sm font-medium">
                      Connect Wallet
                    </div>
                  </div>
                }
              >
                <WalletConnectButton />
              </ClientOnly>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                © 2024 ReliefDAO. All rights reserved.
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Built with
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Solana</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">&</span>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">J</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Jupiter</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Toast Container */}
      <ClientOnly>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme === 'dark' ? 'dark' : 'light'}
        />
      </ClientOnly>
      
      {/* Debug Panel */}
      <ClientOnly>
        <DebugPanel
          logs={debugLogs}
          isVisible={debugPanelVisible}
          onToggle={() => setDebugPanelVisible(!debugPanelVisible)}
          onClear={() => setDebugLogs([])}
        />
      </ClientOnly>
    </div>
  )
} 