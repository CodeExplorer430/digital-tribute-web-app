import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    const variants = {
      primary:
        'bg-primary text-primary-foreground shadow-sm hover:brightness-95 focus-visible:ring-[3px] focus-visible:ring-ring/70',
      secondary:
        'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/75 focus-visible:ring-[3px] focus-visible:ring-ring/70',
      outline:
        'border border-input bg-transparent text-foreground hover:bg-accent/70 focus-visible:ring-[3px] focus-visible:ring-ring/70',
      ghost:
        'text-foreground hover:bg-accent/70 focus-visible:ring-[3px] focus-visible:ring-ring/70',
      danger:
        'bg-destructive text-destructive-foreground shadow-sm hover:brightness-95 focus-visible:ring-[3px] focus-visible:ring-destructive/30',
    }

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-md',
      md: 'h-10 px-4 text-sm rounded-md',
      lg: 'h-12 px-7 text-base rounded-lg',
      icon: 'h-10 w-10 rounded-md',
    }

    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background,color,box-shadow,transform] duration-200 ease-out',
          'focus-visible:outline-none disabled:pointer-events-none disabled:opacity-55 active:scale-[0.99]',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
