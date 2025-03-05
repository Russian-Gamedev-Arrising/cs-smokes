import { GoBack } from "@features/go-back"
import { GrenadeOverview } from "@widgets/grenade-overview/grenade-overview"
import { useMemo } from "react"
// import { useParams } from "react-router-dom"

export function GrenadePage() {
    // const params = useParams()
    const grenadeId = useMemo(() => {
        return 1
    }, [])

    return (
        <>
            <GoBack />
            <GrenadeOverview grenadeId={grenadeId} />
        </>
    )
}
