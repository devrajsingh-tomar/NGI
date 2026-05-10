"use client";

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 hover:bg-orange-600 border border-transparent",
                destructive: "bg-rose-500 text-white shadow-lg shadow-rose-500/25 hover:bg-rose-600 hover:shadow-rose-500/30 hover:-translate-y-0.5",
                outline: "border-2 border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary hover:bg-orange-50 shadow-sm",
                secondary: "bg-orange-100 text-primary font-black hover:bg-orange-200 shadow-sm",
                ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-600",
                link: "text-primary underline-offset-4 hover:underline font-bold",
            },
            size: {
                default: "h-11 px-6 py-2.5",
                sm: "h-9 rounded-lg px-4 text-xs",
                lg: "h-14 rounded-[1rem] px-10 text-base",
                icon: "h-11 w-11",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null;
    size?: "default" | "sm" | "lg" | "icon" | null;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant: variant as any, size: size as any, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
