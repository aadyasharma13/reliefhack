import { toast } from 'react-toastify'

// Success notifications
export const showSuccess = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

// Error notifications
export const showError = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 7000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

// Info notifications
export const showInfo = (message: string) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

// Warning notifications
export const showWarning = (message: string) => {
  toast.warning(message, {
    position: "top-right",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

// Specific notification functions for the app
export const showQuoteFetched = (inputAmount: number, inputToken: string, outputAmount: number) => {
  showInfo(`Quote: ${inputAmount} ${inputToken} → ${outputAmount.toFixed(2)} USDC`)
}

export const showDonationSuccess = (amount: number) => {
  showSuccess(`Successfully donated ${amount.toFixed(2)} USDC to treasury!`)
}

export const showTriggerStarted = () => {
  showInfo('Disaster relief payouts initiated...')
}

export const showTriggerCompleted = () => {
  showSuccess('Payouts sent to recipients successfully!')
}

export const showWalletConnected = (address: string) => {
  showSuccess(`Wallet connected: ${address.slice(0, 4)}...${address.slice(-4)}`)
}

export const showInsufficientBalance = () => {
  showError('Insufficient balance for this transaction')
}

export const showApiError = (message: string) => {
  showError(`API Error: ${message}`)
} 