import type { Metadata, Viewport } from 'next'
import { Great_Vibes, Raleway } from 'next/font/google'
import './globals.css'

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-great-vibes',
  display: 'swap',
})

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-futura',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Allen & Vea | Wedding Invitation',
  description: 'You are cordially invited to celebrate the union of Allen Bogaoisan and Vea Lee Mantilla on March 28, 2026 in Hawaii.',
  generator: 'v0.app',
  icons: {
    icon: '/logowithoutname.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#8fac8f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${greatVibes.variable} ${raleway.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground overflow-x-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
