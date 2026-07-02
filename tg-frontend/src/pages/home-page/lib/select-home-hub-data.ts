import { GrenadeModel } from "@entities/grenade"
import { MapModel, MapPageModel } from "@entities/map"

type FeaturedMapCandidate = MapModel & {
    isEsportsPool?: boolean
}

const sortMapsByName = <T extends MapModel>(maps: T[]) =>
    [...maps].sort((a, b) => a.name.localeCompare(b.name) || a.mapId - b.mapId)

export function selectFeaturedMap(
    maps?: FeaturedMapCandidate[] | null
): FeaturedMapCandidate | undefined {
    if (!maps?.length) {
        return undefined
    }

    const sortedMaps = sortMapsByName(maps)
    const esportsPoolMap = sortedMaps.find((map) => map.isEsportsPool === true)

    return esportsPoolMap ?? sortedMaps[0]
}

export function selectRecentLineups(
    mapPage?: MapPageModel | null
): GrenadeModel[] {
    return [...(mapPage?.mapLineups ?? [])].sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    )
}
