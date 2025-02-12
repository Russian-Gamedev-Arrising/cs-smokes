import { Main } from "@widgets/main"
import classes from "./layout.module.scss"
import { Outlet } from "react-router-dom"
import { Header } from "@widgets/header"

export function Layout() {
    return (
        <div className={classes.appContainer}>
            <div className={classes.background} />
            <div className={classes.page}>
                <Header />
                <Main>
                    <Outlet />
                </Main>
            </div>
        </div>
    )
}
