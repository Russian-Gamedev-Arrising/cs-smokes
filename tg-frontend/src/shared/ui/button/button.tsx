import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { forwardRef, ReactNode, useMemo } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"
import classes from "./button.module.scss"

export const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:text-primary-foreground",
                destructive:
                    "border-transparent bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
                outline:
                    "border border-input bg-transparent text-foreground shadow-xs hover:bg-secondary hover:text-secondary-foreground",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
                ghost: "border-transparent text-foreground hover:bg-secondary hover:text-primary",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "py-[18px] px-[15px] has-[>svg]:px-3",
                sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
                lg: "py-[12px] rounded-md px-[18px] has-[>svg]:px-4",
                icon: "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

type ButtonProps = React.ComponentProps<"button"> & {
    variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link"
    size?: "default" | "sm" | "lg" | "icon"
    asChild?: boolean
    isLoading?: boolean
    loaderPosition?: "before" | "after"
    loaderElement?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    function Button(
        {
            className,
            variant,
            size,
            asChild = false,
            isLoading = false,
            loaderPosition = "before",
            loaderElement = <Loader2 className='animate-spin' />,
            ...props
        },
        ref
    ) {
        const combinedButtonClass: string = useMemo(() => {
            const draftClass: string = cn(
                classes.button,
                buttonVariants({ variant, size, className })
            )

            return draftClass
        }, [variant, size, className])

        if (isLoading) {
            if (size === "icon") {
                return (
                    <button
                        ref={ref}
                        type='button'
                        data-slot='button'
                        className={combinedButtonClass}
                        {...props}
                        disabled={true}
                    >
                        {loaderElement}
                    </button>
                )
            } else {
                if (loaderPosition === "before") {
                    return (
                        <button
                            ref={ref}
                            type='button'
                            data-slot='button'
                            className={combinedButtonClass}
                            {...props}
                            disabled={true}
                        >
                            {loaderElement}
                            {props.value}
                        </button>
                    )
                } else if (loaderPosition === "after") {
                    return (
                        <button
                            ref={ref}
                            type='button'
                            data-slot='button'
                            className={combinedButtonClass}
                            {...props}
                            disabled={true}
                        >
                            {props.value}
                            {loaderElement}
                        </button>
                    )
                }
            }
        }

        if (asChild) {
            return (
                <Slot
                    ref={ref}
                    data-slot='button'
                    className={combinedButtonClass}
                    {...props}
                />
            )
        }

        return (
            <button
                ref={ref}
                type='button'
                data-slot='button'
                className={combinedButtonClass}
                {...props}
            />
        )
    }
)
