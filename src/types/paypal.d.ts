interface PayPalButtons {
  createOrder: (data: any) => Promise<string>
  onApprove: (data: any) => Promise<void>
  onError: (err: any) => void
  render: (selector: string) => void
}

interface PayPal {
  Buttons: (options: {
    createOrder: () => string
    onApprove: (data: any) => Promise<void>
    onError: (err: any) => void
  }) => PayPalButtons
}

declare global {
  interface Window {
    paypal: PayPal
  }
}
