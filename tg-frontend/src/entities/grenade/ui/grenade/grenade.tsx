import React, { ReactNode } from "react"
import { Link } from "react-router-dom"
import { Frown } from "lucide-react"
import clsx from "clsx"
import { GrenadeModel } from "../../model/domain"
import { getRequestHref, getRequestStatusMeta } from "../../lib/request-status"
import classes from "./grenade.module.scss"
import { Card, CardContent, CardFooter, CardHeader } from "@shared/ui/card"
import { Badge } from "@shared/ui/badge"
import { ImageComponent } from "@shared/ui/image"

type GrenadeProps = React.ComponentProps<"div"> & {
    grenade: GrenadeModel
    bottomSlot?: ReactNode
    className?: string
    isLoading?: boolean
    isError?: boolean
}

export function Grenade({
    grenade,
    bottomSlot,
    className,
    isLoading: _isLoading,
    isError: _isError,
    ...rest
}: GrenadeProps) {
    const requestMeta = getRequestStatusMeta(grenade.request.status)
    const requestHref = getRequestHref(grenade.request)
    const keyProperties = grenade.propertyList.slice(0, 3)

    return (
        <Card className={clsx(classes.grenadeCard, className)} {...rest}>
            <CardHeader className={classes.header}>
                <Link
                    to={`/grenades/${grenade.grenadeId}`}
                    className={classes.previewLink}
                    aria-label={`Open ${grenade.title}`}
                >
                    <ImageComponent
                        className={classes.preview}
                        url={grenade.previewImageLink}
                        alt={`"${grenade.title}" preview`}
                        skeletonClasses={classes.previewPlaceholder}
                        placeholderElement={
                            <>
                                <span>No image</span>
                                <Frown />
                            </>
                        }
                    />
                </Link>
                <div className={classes.statusRow}>
                    <Badge color={grenade.isApproved ? "success" : "danger"}>
                        {grenade.isApproved ? "Approved" : "Not approved"}
                    </Badge>
                    <Badge color={grenade.isFavorite ? "accent" : "neutral"}>
                        {grenade.isFavorite ? "Favorite" : "Not favorite"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className={classes.content}>
                <div className={classes.titleBlock}>
                    <Link
                        to={`/grenades/${grenade.grenadeId}`}
                        className={classes.titleLink}
                    >
                        {grenade.title}
                    </Link>
                    <span className={classes.grenadeClass}>
                        {grenade.grenadeClass.name}
                    </span>
                </div>
                <div className={classes.metaGrid}>
                    <span>{grenade.views} views</span>
                    <span>Map #{grenade.mapId}</span>
                </div>
                <div className={classes.badges}>
                    <Badge color={requestMeta.tone}>
                        {requestMeta.shortLabel}
                    </Badge>
                    {requestHref && (
                        <Link className={classes.requestLink} to={requestHref}>
                            Request
                        </Link>
                    )}
                </div>
                {keyProperties.length > 0 && (
                    <div className={classes.properties}>
                        {keyProperties.map((property) => (
                            <Badge
                                key={property.propertyId}
                                color='neutral'
                                radius='sm'
                            >
                                {property.name}: {property.value}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
            {bottomSlot && (
                <CardFooter className={classes.footer}>{bottomSlot}</CardFooter>
            )}
        </Card>
    )
}
