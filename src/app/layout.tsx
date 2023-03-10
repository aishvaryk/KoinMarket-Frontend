import './globals.css'

export const metadata = {
  title: 'KoinMarket',
  description: 'Cryptocurrencies Market Data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
