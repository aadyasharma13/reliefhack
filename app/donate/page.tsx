"use client"

import Layout from '@/components/layout'
import DonateForm from '@/components/donate-form'
import { JupiterProvider } from '@jup-ag/react-hook'
import { useConnection } from '@solana/wallet-adapter-react'
import { useWallet } from '@solana/wallet-adapter-react'

export default function DonatePage() {
  const { connection } = useConnection();
  const wallet = useWallet();

  return (
    <Layout>
      <JupiterProvider
        connection={connection}
        userPublicKey={wallet.publicKey || undefined}
      >
        <div className="max-w-7xl mx-auto">
          {/* Donation Form */}
          <DonateForm />
        </div>
      </JupiterProvider>
    </Layout>
  )
} 