import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import WalletContextProvider from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Disaster Relief DAO',
  description: 'A decentralized platform for transparent and efficient disaster relief fundraising and distribution.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  )
} 