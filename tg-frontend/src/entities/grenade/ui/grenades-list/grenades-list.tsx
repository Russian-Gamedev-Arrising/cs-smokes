import { GrenadeModel, GrenadesListMaper } from "../../model/domain"
import classes from "./grenades-list.module.scss"
import { ItemsList } from "@shared/ui/items-list"
import { PlaceholderBlock } from "@shared/ui/placeholder-block"

type GrenadesListProps = {
    grenades?: GrenadeModel[]
    mapFunction: GrenadesListMaper
    isError?: boolean
    isLoading?: boolean
    emptyMessage?: string
}

// Component that ONLY displays provided data, all api requests moved to the features
export function GrenadesListComponent({
    grenades,
    isError,
    emptyMessage = "No lineups found",
    mapFunction,
    ...rest
}: GrenadesListProps) {
    if (isError) {
        return (
            <PlaceholderBlock>
                Something went wrong in grenades list...
            </PlaceholderBlock>
        )
    }

    if (!rest.isLoading && (!grenades || grenades.length === 0)) {
        return (
            <PlaceholderBlock>
                <span>{emptyMessage}</span>
            </PlaceholderBlock>
        )
    }

    return (
        <ItemsList
            type='grid'
            elements={grenades}
            mapFunction={mapFunction}
            loadingItemsLength={5}
            columnsMode='custom'
            customColumnsClassName={classes.grenadesList}
            {...rest}
        />
    )
}
