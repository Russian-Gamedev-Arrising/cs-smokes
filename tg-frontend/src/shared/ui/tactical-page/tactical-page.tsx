import { ComponentProps, ReactNode } from "react"
import clsx from "clsx"
import classes from "./tactical-page.module.scss"

type TacticalPageProps = ComponentProps<"section"> & {
    eyebrow?: string
    title?: string
    subtitle?: string
    action?: ReactNode
}

export function TacticalPage({
    eyebrow,
    title,
    subtitle,
    action,
    children,
    className,
    ...rest
}: TacticalPageProps) {
    return (
        <section className={clsx(classes.page, className)} {...rest}>
            {(eyebrow || title || subtitle || action) && (
                <div className={classes.header}>
                    <div className={classes.headerText}>
                        {eyebrow && (
                            <p className={classes.eyebrow}>{eyebrow}</p>
                        )}
                        {title && <h1 className={classes.title}>{title}</h1>}
                        {subtitle && (
                            <p className={classes.subtitle}>{subtitle}</p>
                        )}
                    </div>
                    {action && <div className={classes.action}>{action}</div>}
                </div>
            )}
            {children}
        </section>
    )
}

export function TacticalSurface({
    className,
    ...props
}: ComponentProps<"div">) {
    return <div className={clsx(classes.surface, className)} {...props} />
}

export function TacticalToolbar({
    className,
    ...props
}: ComponentProps<"div">) {
    return <div className={clsx(classes.toolbar, className)} {...props} />
}
