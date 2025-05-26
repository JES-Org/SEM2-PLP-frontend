'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MessageMobileHeaderProps {
  title: string
  onMenuToggle: () => void
  showBackButton?: boolean
  onBack?: () => void
}

export const MessageMobileHeader = ({
  title,
  onMenuToggle,
  showBackButton = false,
  onBack,
}: MessageMobileHeaderProps) => {
  return (
    <div className="md:hidden fixed top-0 right-0 z-10 bg-white border-b flex items-center justify-between px-4 py-2 shadow">
      {showBackButton ? (
        <Button variant="ghost" size="icon" onClick={onBack}>
          <Menu className="h-6 w-6" />
        </Button>
      ) : (
        <Button variant="ghost" size="icon" onClick={onMenuToggle}>
          <Menu className="h-6 w-6" />
        </Button>
      )}
      <h2 className="font-semibold text-lg">{title}</h2>
      <div className="w-10" /> {/* Spacer for alignment */}
    </div>
  )
}
