import classes from "./grenade.module.scss"
import { GrenadeModel } from "../domain"

type GrenadeProps = {
    grenade: GrenadeModel
}

export function Grenade({ grenade }: GrenadeProps) {
    return (
        <div className={classes.grenade}>
            <span>{grenade.grenade_id}</span>
        </div>
    )
}
