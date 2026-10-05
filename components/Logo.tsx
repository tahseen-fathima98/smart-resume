import React from 'react'

export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 4.5C8 3.67 8.67 3 9.5 3H19l6 6v18.5c0 .83-.67 1.5-1.5 1.5h-16c-.83 0-1.5-.67-1.5-1.5v-23z"
        fill="var(--accent)"
      />
      <path d="M19 3l6 6h-4.5c-.83 0-1.5-.67-1.5-1.5V3z" fill="#ffffff" fillOpacity="0.35" />
      <path
        d="M11.5 17.5l3 3 6-6.5"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
