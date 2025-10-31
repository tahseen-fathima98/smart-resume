import '../styles/globals.css'
import React from 'react'

export const metadata = {
  title: 'Smart Resume Builder',
  description: 'Smart resume components demo — Next.js + Tailwind + HF AI'
}

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
