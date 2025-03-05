import { GrenadeModel } from "../domain"
import { Card, CardContent, CardHeader } from "@shared/ui/card"

type GrenadeProps = {
    grenade: GrenadeModel
}

export function Grenade({ grenade }: GrenadeProps) {
    return (
        <Card>
            <CardHeader>
                <span>Grenade id:</span>
                <span>{grenade.grenade_id}</span>
            </CardHeader>
            <CardContent>
                <span>Created at:</span>
                <span>{grenade.created_at.toISOString()}</span>
            </CardContent>
        </Card>
    )
}
