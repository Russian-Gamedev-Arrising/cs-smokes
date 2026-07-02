import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import classes from "./home-page.module.scss"
import {
    selectFeaturedMap,
    selectRecentLineups,
} from "./lib/select-home-hub-data"
import { LineupToolbar, useMapLineupControls } from "@widgets/map-overview"
import {
    grenadeApi,
    GrenadesListComponent,
    selectLineups,
} from "@entities/grenade"
import { mapApi } from "@entities/map"
import { favoritesMaper } from "@features/favorites/get"
import { Button } from "@shared/ui/button"
import { PlaceholderBlock } from "@shared/ui/placeholder-block"
import { TacticalPage, TacticalSurface } from "@shared/ui/tactical-page"

export function Homepage() {
    const [selectedMapId, setSelectedMapId] = useState<number | null>(null)
    const {
        data: maps,
        isLoading: isMapsLoading,
        isError: isMapsError,
    } = useQuery(mapApi.getMapsOptions())
    const featuredMap = useMemo(() => selectFeaturedMap(maps), [maps])

    useEffect(() => {
        if (!selectedMapId && featuredMap) {
            setSelectedMapId(featuredMap.mapId)
        }
    }, [featuredMap, selectedMapId])

    const {
        data: selectedMap,
        isLoading: isSelectedMapLoading,
        isError: isSelectedMapError,
    } = useQuery({
        ...mapApi.getMapByIdOptions(selectedMapId ?? 1),
        enabled: selectedMapId !== null,
    })
    const shouldLoadFallbackLineups = Boolean(
        selectedMap && selectedMap.mapLineups.length === 0
    )
    const { data: fallbackLineups, isLoading: isFallbackLineupsLoading } =
        useQuery({
            ...grenadeApi.getGrenadesOptions(),
            enabled: shouldLoadFallbackLineups,
        })
    const selectedMapWithFallback = useMemo(() => {
        if (!selectedMap) {
            return selectedMap
        }

        if (selectedMap.mapLineups.length > 0) {
            return selectedMap
        }

        return {
            ...selectedMap,
            mapLineups: (fallbackLineups ?? []).filter(
                (lineup) => lineup.mapId === selectedMap.mapId
            ),
        }
    }, [fallbackLineups, selectedMap])
    const selectedMapLineups = useMemo(
        () => selectRecentLineups(selectedMapWithFallback),
        [selectedMapWithFallback]
    )
    const lineupControls = useMapLineupControls(selectedMapLineups)
    const visibleLineups = useMemo(
        () => lineupControls.filteredLineups.slice(0, 8),
        [lineupControls.filteredLineups]
    )
    const fastFavorites = useMemo(
        () =>
            selectLineups(selectedMapLineups, { isFavorite: true }).slice(0, 4),
        [selectedMapLineups]
    )

    if (isMapsLoading) {
        return (
            <TacticalPage title='Tactical hub' eyebrow='CS2 utility'>
                <TacticalSurface>
                    <p>Loading maps...</p>
                </TacticalSurface>
            </TacticalPage>
        )
    }

    if (isMapsError) {
        return (
            <PlaceholderBlock>
                Error acquired while loading tactical hub maps.
            </PlaceholderBlock>
        )
    }

    if (!maps || maps.length === 0 || !featuredMap) {
        return (
            <TacticalPage
                title='Tactical hub'
                eyebrow='CS2 utility'
                action={
                    <Button asChild>
                        <Link to='/grenades/create'>Add lineup</Link>
                    </Button>
                }
            >
                <PlaceholderBlock>No maps were provided.</PlaceholderBlock>
            </TacticalPage>
        )
    }

    return (
        <TacticalPage
            eyebrow='CS2 utility'
            title='Tactical hub'
            subtitle='Pick a map, scan existing lineups, and jump into the selected map workflow.'
            action={
                <Button asChild>
                    <Link to='/grenades/create'>Add lineup</Link>
                </Button>
            }
        >
            <TacticalSurface className={classes.featuredMap}>
                <div className={classes.featuredText}>
                    <span className={classes.kicker}>Featured map</span>
                    <h2>{selectedMap?.name ?? featuredMap.name}</h2>
                    <p>
                        {selectedMapWithFallback
                            ? `${selectedMapWithFallback.mapLineups.length} lineups loaded`
                            : "Select a map to load lineups"}
                    </p>
                    <div className={classes.heroActions}>
                        <Button asChild>
                            <Link
                                to={`/maps/${selectedMapId ?? featuredMap.mapId}/grenades`}
                            >
                                Open map lineups
                            </Link>
                        </Button>
                        <Button asChild variant='outline'>
                            <Link to='/maps'>All maps</Link>
                        </Button>
                    </div>
                </div>
                {(selectedMap?.imageLink ?? featuredMap.imageLink) && (
                    <img
                        className={classes.previewImage}
                        src={
                            selectedMap?.imageLink ??
                            featuredMap.imageLink ??
                            ""
                        }
                        alt={`${selectedMap?.name ?? featuredMap.name} preview`}
                        loading='lazy'
                    />
                )}
            </TacticalSurface>
            <TacticalSurface className={classes.mapSelector}>
                {maps.map((map) => (
                    <button
                        key={map.mapId}
                        type='button'
                        className={
                            selectedMapId === map.mapId
                                ? classes.activeMapChip
                                : classes.mapChip
                        }
                        aria-pressed={selectedMapId === map.mapId}
                        onClick={() => setSelectedMapId(map.mapId)}
                    >
                        {map.name}
                    </button>
                ))}
            </TacticalSurface>
            {isSelectedMapError && (
                <PlaceholderBlock>
                    Error acquired while loading selected map lineups.
                </PlaceholderBlock>
            )}
            {!isSelectedMapError && (
                <>
                    <TacticalSurface>
                        <LineupToolbar
                            mapId={selectedMapId ?? featuredMap.mapId}
                            controls={lineupControls.controls}
                            grenadeClasses={lineupControls.grenadeClasses}
                            propertyChips={lineupControls.propertyChips}
                            requestStatuses={lineupControls.requestStatuses}
                            sortModes={lineupControls.sortModes}
                            resultCount={lineupControls.filteredLineups.length}
                            totalCount={selectedMapLineups.length}
                            setControl={lineupControls.setControl}
                            togglePropertyChip={
                                lineupControls.togglePropertyChip
                            }
                            resetControls={lineupControls.resetControls}
                        />
                    </TacticalSurface>
                    <GrenadesListComponent
                        grenades={visibleLineups}
                        mapFunction={favoritesMaper}
                        isLoading={
                            isSelectedMapLoading || isFallbackLineupsLoading
                        }
                        emptyMessage='No selected-map lineups match these controls'
                    />
                    {fastFavorites.length > 0 && (
                        <TacticalSurface className={classes.fastSection}>
                            <div>
                                <span className={classes.kicker}>
                                    Fast filter
                                </span>
                                <h2>Favorites on this map</h2>
                            </div>
                            <GrenadesListComponent
                                grenades={fastFavorites}
                                mapFunction={favoritesMaper}
                                emptyMessage='No favorite lineups on this map'
                            />
                        </TacticalSurface>
                    )}
                </>
            )}
        </TacticalPage>
    )
}
