import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    const variants = {
      primary:
        'border border-primary/80 bg-[linear-gradient(135deg,rgba(91,121,99,0.98),rgba(70,97,78,0.96))] text-primary-foreground shadow-[0_16px_34px_rgba(67,94,75,0.2)] hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(67,94,75,0.22)] focus-visible:ring-[3px] focus-visible:ring-ring/70',
      secondary:
        'border border-border/70 bg-[linear-gradient(180deg,rgba(247,243,235,0.96),rgba(234,228,216,0.96))] text-secondary-foreground shadow-[0_12px_28px_rgba(42,49,42,0.08)] hover:-translate-y-0.5 hover:bg-secondary/90 focus-visible:ring-[3px] focus-visible:ring-ring/70',
      outline:
        'border border-input bg-white/55 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] hover:-translate-y-0.5 hover:bg-accent/70 focus-visible:ring-[3px] focus-visible:ring-ring/70',
      ghost:
        'text-foreground hover:bg-accent/70 focus-visible:ring-[3px] focus-visible:ring-ring/70',
      danger:
        'border border-destructive/70 bg-[linear-gradient(135deg,rgba(187,72,72,0.98),rgba(152,46,46,0.96))] text-destructive-foreground shadow-[0_14px_34px_rgba(152,46,46,0.22)] hover:-translate-y-0.5 hover:brightness-95 focus-visible:ring-[3px] focus-visible:ring-destructive/30',
    }

    const sizes = {
      sm: 'h-9 px-3.5 text-xs rounded-xl',
      md: 'h-11 px-4.5 text-sm rounded-xl',
      lg: 'h-13 px-7 text-base rounded-2xl',
      icon: 'h-11 w-11 rounded-xl',
    }

    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background,color,box-shadow,transform,border-color] duration-200 ease-out',
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
