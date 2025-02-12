import { HTMLAttributes, ReactNode } from "react"
import classes from "./button.module.scss"

type ButtonProps = {
    children: ReactNode
    onClick?: () => void
}

export function Button(props: ButtonProps & HTMLAttributes<HTMLButtonElement>) {
    return (
        <button className={classes.button} onClick={props.onClick}>
            {props.children}
        </button>
    )
}
