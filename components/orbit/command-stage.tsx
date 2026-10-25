'use client'

import type { ReactNode } from 'react'

interface CommandStageProps {
  children: ReactNode
  viewKey: string
}

export function CommandStage({ children, viewKey }: CommandStageProps) {
  return (
    <div className="flex-1 h-full overflow-hidden bg-background">
      <div key={viewKey} className="h-full overflow-auto animate-in fade-in duration-150">
        {children}
      </div>
    </div>
  )
}
