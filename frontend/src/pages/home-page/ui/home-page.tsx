import { Header } from "@app/layout/header"
import { Main } from "@app/layout/main"
import { Footer } from "@app/layout/footer"
import classes from "./home-page.module.scss"

export function Homepage() {
    return (
        <>
            <div className={classes.background} />
            <div className={classes.homepage}>
                <Header />
                <Main>Hello world!</Main>
                <Footer />
            </div>
        </>
    )
}
