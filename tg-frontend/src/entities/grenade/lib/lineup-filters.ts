import { GrenadeModel } from "../model/domain"

export type LineupRequestStatus = GrenadeModel["request"]["status"]

export type LineupSortMode =
    | "createdAtDesc"
    | "createdAtAsc"
    | "titleAsc"
    | "titleDesc"
    | "viewsDesc"
    | "viewsAsc"

export type LineupFilters = {
    query?: string
    grenadeClassId?: number | null
    grenadeClassName?: string | null
    isApproved?: boolean | null
    isFavorite?: boolean | null
    requestStatus?: LineupRequestStatus | null
    propertyChips?: string[]
}

export type LineupFilterOptions = LineupFilters & {
    sort?: LineupSortMode
}

const normalize = (value: string | number | null | undefined) =>
    String(value ?? "")
        .trim()
        .toLowerCase()

const getSearchHaystack = (lineup: GrenadeModel) =>
    [
        lineup.title,
        lineup.description,
        lineup.creator.username,
        lineup.grenadeClass.name,
        ...lineup.propertyList.flatMap((property) => [
            property.name,
            property.value,
            `${property.name} ${property.value}`,
        ]),
    ]
        .map(normalize)
        .join(" ")

export function getLineupPropertyChips(lineups: GrenadeModel[]) {
    const chips: Set<string> = new Set()

    lineups.forEach((lineup) => {
        lineup.propertyList.forEach((property) => {
            chips.add(`${property.name}:${property.value}`)
        })
    })

    return Array.from(chips).sort((a, b) => a.localeCompare(b))
}

export function getLineupGrenadeClasses(lineups: GrenadeModel[]) {
    const classes: Map<number, GrenadeModel["grenadeClass"]> = new Map()

    lineups.forEach((lineup) => {
        classes.set(lineup.grenadeClass.grenadeClassId, lineup.grenadeClass)
    })

    return Array.from(classes.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
    )
}

export function filterLineups(
    lineups: GrenadeModel[],
    filters: LineupFilters = {}
) {
    const query = normalize(filters.query)
    const grenadeClassName = normalize(filters.grenadeClassName)
    const propertyChips = new Set(
        (filters.propertyChips ?? []).map(normalize).filter(Boolean)
    )

    return lineups.filter((lineup) => {
        if (query && !getSearchHaystack(lineup).includes(query)) {
            return false
        }

        if (
            filters.grenadeClassId != null &&
            lineup.grenadeClass.grenadeClassId !== filters.grenadeClassId
        ) {
            return false
        }

        if (
            grenadeClassName &&
            normalize(lineup.grenadeClass.name) !== grenadeClassName
        ) {
            return false
        }

        if (
            filters.isApproved != null &&
            lineup.isApproved !== filters.isApproved
        ) {
            return false
        }

        if (
            filters.isFavorite != null &&
            lineup.isFavorite !== filters.isFavorite
        ) {
            return false
        }

        if (
            filters.requestStatus &&
            lineup.request.status !== filters.requestStatus
        ) {
            return false
        }

        if (propertyChips.size > 0) {
            const lineupChips = new Set(
                lineup.propertyList.flatMap((property) => [
                    normalize(property.name),
                    normalize(property.value),
                    normalize(`${property.name}:${property.value}`),
                    normalize(`${property.name} ${property.value}`),
                ])
            )

            for (const chip of propertyChips) {
                if (!lineupChips.has(chip)) {
                    return false
                }
            }
        }

        return true
    })
}

export function sortLineups(
    lineups: GrenadeModel[],
    sort: LineupSortMode = "createdAtDesc"
) {
    const sortedLineups = [...lineups]

    sortedLineups.sort((a, b) => {
        switch (sort) {
            case "createdAtAsc":
                return Date.parse(a.createdAt) - Date.parse(b.createdAt)
            case "titleAsc":
                return a.title.localeCompare(b.title)
            case "titleDesc":
                return b.title.localeCompare(a.title)
            case "viewsAsc":
                return a.views - b.views
            case "viewsDesc":
                return b.views - a.views
            case "createdAtDesc":
            default:
                return Date.parse(b.createdAt) - Date.parse(a.createdAt)
        }
    })

    return sortedLineups
}

export function selectLineups(
    lineups: GrenadeModel[],
    options: LineupFilterOptions = {}
) {
    return sortLineups(filterLineups(lineups, options), options.sort)
}
