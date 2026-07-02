import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Slash } from "lucide-react"
import { useMapLineupControls } from "../model/use-map-lineup-controls"
import classes from "./map-overview.module.scss"
import { LineupToolbar } from "./lineup-toolbar"
import { grenadeApi, GrenadesListComponent } from "@entities/grenade"
import { mapApi, MapPageModel } from "@entities/map"
import { PlaceholderBlock } from "@shared/ui/placeholder-block"
import { ItemsList } from "@shared/ui/items-list"
import { favoritesMaper } from "@features/favorites/get"
import { Button } from "@shared/ui/button"
import { TacticalPage, TacticalSurface } from "@shared/ui/tactical-page"
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbSeparator,
} from "@shared/ui/breadcrumb"

export function MapOverview({ mapId }: { mapId: MapPageModel["mapId"] }) {
    const { data, isError, isLoading } = useQuery(
        mapApi.getMapByIdOptions(mapId)
    )
    const shouldLoadFallbackLineups = Boolean(
        data && data.mapLineups.length === 0
    )
    const { data: fallbackLineups, isLoading: isFallbackLineupsLoading } =
        useQuery({
            ...grenadeApi.getGrenadesOptions(),
            enabled: shouldLoadFallbackLineups,
        })
    const mapLineups =
        data?.mapLineups && data.mapLineups.length > 0
            ? data.mapLineups
            : (fallbackLineups ?? []).filter((lineup) => lineup.mapId === mapId)
    const lineupControls = useMapLineupControls(mapLineups)

    if (isLoading) {
        return <ItemsList isLoading loadingItemsLength={15} />
    }

    if (!data && !isError) {
        return <div>Unexpected state...</div>
    }

    if (isError) {
        return (
            <PlaceholderBlock>
                Error acquired while getting data about map from server(
            </PlaceholderBlock>
        )
    }

    if (!data) {
        return <div>Something went wrong</div>
    }

    return (
        <TacticalPage
            eyebrow='Map lineups'
            title={`${data.name} utility`}
            subtitle='Search, filter and sort approved tactical lineups for this map.'
            action={
                <Button asChild variant='outline'>
                    <Link to={`/maps/${data.mapId}`}>Map information</Link>
                </Button>
            }
        >
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Link to='/maps'>Maps</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <Link to={`/maps/${data.mapId}`}>{data.name}</Link>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <Link to={`/maps/${data.mapId}/grenades`}>lineups</Link>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <TacticalSurface className={classes.mapHero}>
                <div className={classes.mapHeroText}>
                    <h2>{data.name}</h2>
                    <p>{mapLineups.length} loaded lineups</p>
                </div>
                {data.imageLink && (
                    <img
                        className={classes.mapImage}
                        src={data.imageLink}
                        alt={`${data.name} preview`}
                        loading='lazy'
                    />
                )}
            </TacticalSurface>
            <TacticalSurface>
                <LineupToolbar
                    mapId={data.mapId}
                    controls={lineupControls.controls}
                    grenadeClasses={lineupControls.grenadeClasses}
                    propertyChips={lineupControls.propertyChips}
                    requestStatuses={lineupControls.requestStatuses}
                    sortModes={lineupControls.sortModes}
                    resultCount={lineupControls.filteredLineups.length}
                    totalCount={mapLineups.length}
                    setControl={lineupControls.setControl}
                    togglePropertyChip={lineupControls.togglePropertyChip}
                    resetControls={lineupControls.resetControls}
                />
            </TacticalSurface>
            <GrenadesListComponent
                grenades={lineupControls.filteredLineups}
                mapFunction={favoritesMaper}
                isLoading={isLoading || isFallbackLineupsLoading}
                isError={isError}
                emptyMessage='No lineups match these controls'
            />
        </TacticalPage>
    )
}
