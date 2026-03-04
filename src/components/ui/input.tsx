import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-[var(--surface-1)] px-3 py-2 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]',
        'placeholder:text-muted-foreground/90 transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/70 focus-visible:border-foreground/25',
        'disabled:cursor-not-allowed disabled:opacity-55',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export { Input }
