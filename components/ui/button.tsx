import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "rounded-[2.5rem] border-2 border-[#2B292E] bg-[rgba(25,24,29,0.80)] text-white shadow-[0_2px_22px_4px_rgba(165,165,165,0.05)_inset] hover:bg-[rgba(35,34,39,0.90)] hover:shadow-[0_2px_22px_4px_rgba(165,165,165,0.08)_inset]",
        destructive:
          "rounded-[2.5rem] border-2 border-destructive bg-destructive/80 text-white shadow-[0_2px_22px_4px_rgba(165,165,165,0.05)_inset] hover:bg-destructive/90 hover:shadow-[0_2px_22px_4px_rgba(165,165,165,0.08)_inset]",
        outline:
          "rounded-[2.5rem] border-2 border-[#2B292E] bg-transparent text-foreground shadow-[0_2px_22px_4px_rgba(165,165,165,0.05)_inset] hover:bg-[rgba(25,24,29,0.20)] hover:shadow-[0_2px_22px_4px_rgba(165,165,165,0.08)_inset]",
        secondary:
          "rounded-[2.5rem] border-2 border-[#2B292E] bg-[rgba(25,24,29,0.60)] text-secondary-foreground shadow-[0_2px_22px_4px_rgba(165,165,165,0.05)_inset] hover:bg-[rgba(25,24,29,0.80)] hover:shadow-[0_2px_22px_4px_rgba(165,165,165,0.08)_inset]",
        ghost:
          "rounded-[2.5rem] border-2 border-transparent bg-transparent text-foreground hover:bg-[rgba(25,24,29,0.20)] hover:border-[#2B292E]",
        link: "text-primary underline-offset-4 hover:underline border-none bg-transparent shadow-none",
      },
      size: {
        default: "h-10 px-6 py-2 has-[>svg]:px-4",
        sm: "h-8 px-4 py-2 has-[>svg]:px-3",
        lg: "h-12 px-8 py-3 has-[>svg]:px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
