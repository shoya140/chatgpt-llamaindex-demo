'use client'

import './globals.scss'

import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="container">
            <div className="content">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
