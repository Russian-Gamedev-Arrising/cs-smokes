import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import {
    getLineupGrenadeClasses,
    getLineupPropertyChips,
    GrenadeModel,
    LineupFilterOptions,
    LineupRequestStatus,
    LineupSortMode,
    selectLineups,
} from "@entities/grenade"

const sortModes: LineupSortMode[] = [
    "createdAtDesc",
    "createdAtAsc",
    "titleAsc",
    "titleDesc",
    "viewsDesc",
    "viewsAsc",
]

const requestStatuses: LineupRequestStatus[] = [
    "WAITING FOR CREATION",
    "OPEN",
    "APPROVED",
    "REJECTED",
    "MERGED",
    "CLOSED",
]

const controlParamKeys = [
    "q",
    "class",
    "approved",
    "favorite",
    "request",
    "property",
    "sort",
]

const readBooleanParam = (value: string | null) => {
    if (value === "true") {
        return true
    }

    if (value === "false") {
        return false
    }

    return null
}

const readNumberParam = (value: string | null) => {
    if (!value) {
        return null
    }

    const parsed = Number(value)

    return Number.isFinite(parsed) ? parsed : null
}

export function useMapLineupControls(lineups: GrenadeModel[]) {
    const [searchParams, setSearchParams] = useSearchParams()

    const controls = useMemo<LineupFilterOptions>(() => {
        const sortParam = searchParams.get("sort")
        const requestStatus = searchParams.get("request")

        return {
            query: searchParams.get("q") ?? "",
            grenadeClassId: readNumberParam(searchParams.get("class")),
            isApproved: readBooleanParam(searchParams.get("approved")),
            isFavorite: readBooleanParam(searchParams.get("favorite")),
            requestStatus: requestStatuses.includes(
                requestStatus as LineupRequestStatus
            )
                ? (requestStatus as LineupRequestStatus)
                : null,
            propertyChips: searchParams.getAll("property"),
            sort: sortModes.includes(sortParam as LineupSortMode)
                ? (sortParam as LineupSortMode)
                : "createdAtDesc",
        }
    }, [searchParams])

    const filteredLineups = useMemo(
        () => selectLineups(lineups, controls),
        [controls, lineups]
    )

    const grenadeClasses = useMemo(
        () => getLineupGrenadeClasses(lineups),
        [lineups]
    )

    const propertyChips = useMemo(
        () => getLineupPropertyChips(lineups),
        [lineups]
    )

    const setControl = (
        key: string,
        value: string | number | boolean | null | undefined
    ) => {
        setSearchParams((current) => {
            const next = new URLSearchParams(current)

            next.delete(key)

            if (value !== null && value !== undefined && value !== "") {
                next.set(key, String(value))
            }

            return next
        })
    }

    const togglePropertyChip = (chip: string) => {
        setSearchParams((current) => {
            const next = new URLSearchParams(current)
            const values = new Set(next.getAll("property"))

            next.delete("property")

            if (values.has(chip)) {
                values.delete(chip)
            } else {
                values.add(chip)
            }

            values.forEach((value) => next.append("property", value))

            return next
        })
    }

    const resetControls = () => {
        setSearchParams((current) => {
            const next = new URLSearchParams(current)

            controlParamKeys.forEach((key) => next.delete(key))

            return next
        })
    }

    return {
        controls,
        filteredLineups,
        grenadeClasses,
        propertyChips,
        requestStatuses,
        sortModes,
        setControl,
        togglePropertyChip,
        resetControls,
    }
}
