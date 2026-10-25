'use client'

import React from 'react'
import { Send, type LucideProps } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Money Outflow Icon (Payouts / Disbursements)
 * Uses the standard Send paper plane pointing up-right (↗)
 */
export const MoneyOutIcon = Send

/**
 * Money Inflow Icon (Collections / USSD *671#)
 * Exactly mirrors MoneyOutIcon but inverted 180° to point down-left (↙)
 * Strictly maintaining visual parity across stroke, geometry, and design language.
 */
export const MoneyInIcon = React.forwardRef<SVGSVGElement, LucideProps>(
  ({ className, ...props }, ref) => {
    return <Send ref={ref} className={cn('rotate-180', className)} {...props} />
  }
)

MoneyInIcon.displayName = 'MoneyInIcon'
