import { Link } from "react-router-dom"
import { ArrowUpDown, Plus, RotateCcw, SlidersHorizontal } from "lucide-react"
import classes from "./lineup-toolbar.module.scss"
import {
    LineupFilterOptions,
    LineupRequestStatus,
    LineupSortMode,
    GrenadeModel,
    getRequestStatusMeta,
} from "@entities/grenade"
import { Button } from "@shared/ui/button"
import { Input } from "@shared/ui/input"
import { Select } from "@shared/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@shared/ui/tooltip"

type LineupToolbarProps = {
    mapId: number
    controls: LineupFilterOptions
    grenadeClasses: GrenadeModel["grenadeClass"][]
    propertyChips: string[]
    requestStatuses: LineupRequestStatus[]
    sortModes: LineupSortMode[]
    resultCount: number
    totalCount: number
    setControl: (
        key: string,
        value: string | number | boolean | null | undefined
    ) => void
    togglePropertyChip: (chip: string) => void
    resetControls: () => void
}

const booleanOptions = [
    { value: "", label: "Any" },
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
]

const sortLabels: Record<LineupSortMode, string> = {
    createdAtDesc: "Newest",
    createdAtAsc: "Oldest",
    titleAsc: "Title A-Z",
    titleDesc: "Title Z-A",
    viewsDesc: "Views high",
    viewsAsc: "Views low",
}

export function LineupToolbar({
    mapId,
    controls,
    grenadeClasses,
    propertyChips,
    requestStatuses,
    sortModes,
    resultCount,
    totalCount,
    setControl,
    togglePropertyChip,
    resetControls,
}: LineupToolbarProps) {
    const activePropertyChips = new Set(controls.propertyChips ?? [])

    return (
        <div className={classes.toolbar}>
            <div className={classes.mobileRow}>
                <Input
                    whithIcon
                    type='search'
                    aria-label='Search lineups'
                    placeholder='Search lineups'
                    value={controls.query ?? ""}
                    className={classes.search}
                    onChange={(event) => setControl("q", event.target.value)}
                />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size='icon'
                            variant='outline'
                            aria-label='Filter lineups'
                        >
                            <SlidersHorizontal aria-hidden='true' />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Filter lineups</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size='icon'
                            variant='outline'
                            aria-label='Sort lineups'
                        >
                            <ArrowUpDown aria-hidden='true' />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Sort lineups</TooltipContent>
                </Tooltip>
            </div>
            <Button asChild className={classes.addButton}>
                <Link to={`/grenades/create?mapId=${mapId}`}>
                    <Plus aria-hidden='true' />
                    Add lineup
                </Link>
            </Button>
            <div className={classes.controlsPanel}>
                <Select
                    withLabel
                    label='Grenade'
                    value={String(controls.grenadeClassId ?? "")}
                    onChange={(event) =>
                        setControl("class", event.target.value || null)
                    }
                    options={[
                        { value: "", label: "All types" },
                        ...grenadeClasses.map((grenadeClass) => ({
                            value: String(grenadeClass.grenadeClassId),
                            label: grenadeClass.name,
                        })),
                    ]}
                />
                <Select
                    withLabel
                    label='Approved'
                    value={
                        controls.isApproved == null
                            ? ""
                            : String(controls.isApproved)
                    }
                    onChange={(event) =>
                        setControl("approved", event.target.value || null)
                    }
                    options={booleanOptions}
                />
                <Select
                    withLabel
                    label='Favorite'
                    value={
                        controls.isFavorite == null
                            ? ""
                            : String(controls.isFavorite)
                    }
                    onChange={(event) =>
                        setControl("favorite", event.target.value || null)
                    }
                    options={booleanOptions}
                />
                <Select
                    withLabel
                    label='Request'
                    value={controls.requestStatus ?? ""}
                    onChange={(event) =>
                        setControl("request", event.target.value || null)
                    }
                    options={[
                        { value: "", label: "Any request" },
                        ...requestStatuses.map((status) => ({
                            value: status,
                            label: getRequestStatusMeta(status).shortLabel,
                        })),
                    ]}
                />
                <Select
                    withLabel
                    label='Sort'
                    value={controls.sort ?? "createdAtDesc"}
                    onChange={(event) =>
                        setControl("sort", event.target.value || null)
                    }
                    options={sortModes.map((sortMode) => ({
                        value: sortMode,
                        label: sortLabels[sortMode],
                    }))}
                />
            </div>
            {propertyChips.length > 0 && (
                <div className={classes.propertyChips}>
                    {propertyChips.map((chip) => (
                        <button
                            key={chip}
                            type='button'
                            className={
                                activePropertyChips.has(chip)
                                    ? classes.activeChip
                                    : classes.chip
                            }
                            onClick={() => togglePropertyChip(chip)}
                        >
                            {chip}
                        </button>
                    ))}
                </div>
            )}
            <div className={classes.summary}>
                <span>
                    {resultCount} of {totalCount} lineups
                </span>
                <Button variant='ghost' size='sm' onClick={resetControls}>
                    <RotateCcw aria-hidden='true' />
                    Reset
                </Button>
            </div>
        </div>
    )
}
