import type { Metadata } from 'next'
import './globals.css'
import { ServiceWorkerRegister } from '@/components/public/ServiceWorkerRegister'
import { getAppBaseUrl } from '@/lib/site-url'

export const metadata: Metadata = {
  metadataBase: getAppBaseUrl(),
  title: 'Everlume',
  description:
    'Create and share memorials with photos, timelines, videos, and moderated guestbook messages.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-primary/30">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  )
}
