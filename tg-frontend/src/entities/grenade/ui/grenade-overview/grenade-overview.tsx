import { ReactNode } from "react"
import { Frown } from "lucide-react"
import { Link } from "react-router-dom"
import { GrenadeModel } from "../../model/domain"
import { getRequestHref, getRequestStatusMeta } from "../../lib/request-status"
import classes from "./grenade-overview.module.scss"
import { PlaceholderBlock } from "@shared/ui/placeholder-block"
import { Badge } from "@shared/ui/badge"
import { ImageComponent } from "@shared/ui/image"
import { TacticalSurface } from "@shared/ui/tactical-page"

type GrenadeOverviewProps = {
    grenade?: GrenadeModel
    isLoading?: boolean
    isError?: boolean
    actions?: ReactNode
    mapLabel?: string
}

export function GrenadeOverview({
    grenade,
    isError,
    isLoading,
    actions,
    mapLabel,
}: GrenadeOverviewProps) {
    if (isError) {
        return (
            <PlaceholderBlock data-testid='data-overview-error-placeholder'>
                Something went wrong with grenade overview...
            </PlaceholderBlock>
        )
    }

    if (isLoading) {
        return (
            <div aria-label='loader' data-testid='grenade-overview-loader'>
                Loading...
            </div>
        )
    }

    if (!grenade) {
        return (
            <PlaceholderBlock data-testid='data-overview-empty-grenade'>
                Data was not provided(
            </PlaceholderBlock>
        )
    }

    const requestMeta = getRequestStatusMeta(grenade.request.status)
    const requestHref = getRequestHref(grenade.request)

    return (
        <div className={classes.overview}>
            <ImageComponent
                className={classes.image}
                url={grenade.previewImageLink}
                alt='grenade image'
                skeletonClasses='w-full h-[300px] rounded-[8px] bg-[var(--color-background-alt)] flex flex-col justify-center items-center gap-1'
                placeholderElement={
                    <>
                        <span>Without image</span>
                        <Frown />
                    </>
                }
            />
            <TacticalSurface className={classes.headerSurface}>
                <div className={classes.titleBlock}>
                    <div className={classes.titleRow}>
                        <h1>{grenade.title}</h1>
                        <Badge
                            color={grenade.isApproved ? "success" : "danger"}
                        >
                            {grenade.isApproved ? "Approved" : "Not approved"}
                        </Badge>
                    </div>
                    <div className={classes.metaRow}>
                        <span>{mapLabel ?? `Map #${grenade.mapId}`}</span>
                        <span>{grenade.grenadeClass.name}</span>
                        <span>{grenade.views} views</span>
                    </div>
                </div>
                <div className={classes.badges}>
                    <Badge color={requestMeta.tone}>{requestMeta.label}</Badge>
                    {requestHref && (
                        <Link className={classes.requestLink} to={requestHref}>
                            View request
                        </Link>
                    )}
                </div>
                {actions && <div className={classes.actions}>{actions}</div>}
            </TacticalSurface>
            <TacticalSurface className={classes.detailGrid}>
                <section className={classes.detailBlock}>
                    <h2>Description</h2>
                    <p>{grenade.description || "No description provided."}</p>
                </section>
                <section className={classes.detailBlock}>
                    <h2>Creator</h2>
                    <Link
                        className={classes.creator}
                        to={`/guest/profile/${grenade.creator.userId}`}
                    >
                        <ImageComponent
                            className={classes.avatar}
                            skeletonClasses={classes.avatar}
                            url={grenade.creator.avatarUrl}
                            alt={`${grenade.creator.username} avatar`}
                            width={36}
                            height={36}
                        />
                        <span>{grenade.creator.username}</span>
                    </Link>
                </section>
                <section className={classes.detailBlock}>
                    <h2>Grenade</h2>
                    <dl className={classes.definitionList}>
                        <div>
                            <dt>Type</dt>
                            <dd>{grenade.grenadeClass.name}</dd>
                        </div>
                        <div>
                            <dt>Info</dt>
                            <dd>{grenade.grenadeClass.description}</dd>
                        </div>
                    </dl>
                </section>
                <section className={classes.detailBlock}>
                    <h2>Properties</h2>
                    {grenade.propertyList.length > 0 ? (
                        <div className={classes.properties}>
                            {grenade.propertyList.map((property) => (
                                <Badge
                                    key={property.propertyId}
                                    color='neutral'
                                    radius='sm'
                                >
                                    {property.name}: {property.value}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p>No properties.</p>
                    )}
                </section>
            </TacticalSurface>
        </div>
    )
}
