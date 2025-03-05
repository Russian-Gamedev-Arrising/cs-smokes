import { grenadeApi, grenadeMaper } from "@entities/grenade"
import { useQuery } from "@tanstack/react-query"
import { ItemsList } from "@widgets/items-list"

export function GrenadesList() {
    const { data = [], isLoading, isError } = useQuery(grenadeApi.getGrenades())

    if (isError) {
        return <div>Произошла ошибка...</div>
    }

    return (
        <ItemsList
            elements={data}
            mapFunction={grenadeMaper}
            isLoading={isLoading}
        />
    )
}
