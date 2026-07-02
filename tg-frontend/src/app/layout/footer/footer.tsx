import { NavLink } from "react-router-dom"
import { Heart, Home, Map, Plus, User } from "lucide-react"
import clsx from "clsx"
import classes from "./footer.module.scss"
import { Tooltip, TooltipContent, TooltipTrigger } from "@shared/ui/tooltip"

const config = [
    {
        path: "/",
        icon: Home,
        label: "Hub",
    },
    {
        path: "/maps",
        icon: Map,
        label: "Maps",
    },
    {
        path: "/grenades/create",
        icon: Plus,
        label: "Add lineup",
        isPrimary: true,
    },
    {
        path: "/favorites",
        icon: Heart,
        label: "Favorites",
    },
    {
        path: "/profile",
        icon: User,
        label: "Profile",
    },
]

export function Footer() {
    return (
        <footer className={classes.footer}>
            <nav className={classes.links} aria-label='Primary navigation'>
                {config.map((item) => {
                    const Icon = item.icon
                    return (
                        <Tooltip key={item.path}>
                            <TooltipTrigger asChild>
                                <NavLink
                                    to={item.path}
                                    aria-label={item.label}
                                    className={({ isActive }) =>
                                        clsx(
                                            classes.linkButton,
                                            item.isPrimary &&
                                                classes.primaryLink,
                                            isActive && classes.activeLink
                                        )
                                    }
                                >
                                    <Icon aria-hidden='true' />
                                </NavLink>
                            </TooltipTrigger>
                            <TooltipContent>{item.label}</TooltipContent>
                        </Tooltip>
                    )
                })}
            </nav>
        </footer>
    )
}
