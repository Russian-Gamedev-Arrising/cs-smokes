import { grenadeApi } from "@entities/grenade"
import { Skeleton } from "@shared/ui/skeleton"
import { useQuery } from "@tanstack/react-query"

type GrenadeOverviewProps = {
    grenadeId: number
}

export function GrenadeOverview({ grenadeId }: GrenadeOverviewProps) {
    const { data: grenade, isLoading } = useQuery(
        grenadeApi.getGrenadeById({ grenadeId })
    )

    if (isLoading) {
        return (
            <div>
                <Skeleton className='h-6 w-3.5' />
            </div>
        )
    }

    return (
        <div>
            <h2>
                Граната с ID: <span>{grenade?.grenade_id}</span>
            </h2>
        </div>
    )
}
