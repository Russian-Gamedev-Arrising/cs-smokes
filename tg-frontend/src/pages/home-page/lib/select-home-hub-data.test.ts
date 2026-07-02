import { describe, expect, test } from "vitest"
import { selectFeaturedMap, selectRecentLineups } from "./select-home-hub-data"
import { GrenadeModel } from "@entities/grenade"
import { MapModel, MapPageModel } from "@entities/map"

type MapWithPoolFlag = MapModel & {
    isEsportsPool?: boolean
}

const makeMap = (
    overrides: Partial<MapWithPoolFlag> & Pick<MapModel, "mapId" | "name">
): MapWithPoolFlag => ({
    link: null,
    imageLink: null,
    ...overrides,
})

const makeLineup = (
    overrides: Partial<GrenadeModel> & Pick<GrenadeModel, "grenadeId">
): GrenadeModel => {
    const { grenadeId, ...rest } = overrides

    return {
        grenadeId,
        mapId: 1,
        grenadeClass: {
            grenadeClassId: 1,
            name: "Smoke",
            description: "Blocks vision",
            price: 300,
        },
        propertyList: [],
        linkToVideo: null,
        creator: {
            userId: 1,
            username: "creator",
            avatarUrl: null,
            firstName: null,
            lastName: null,
        },
        createdAt: "2026-01-01T00:00:00Z",
        title: "Default lineup",
        description: null,
        isApproved: true,
        isFavorite: false,
        views: 0,
        previewImageLink: null,
        request: {
            request_id: null,
            status: "WAITING FOR CREATION",
        },
        ...rest,
    }
}

describe("home hub data selectors", () => {
    test("selects the esports-pool map first when that flag is present", () => {
        const maps = [
            makeMap({ mapId: 3, name: "Mirage", isEsportsPool: false }),
            makeMap({ mapId: 2, name: "Nuke", isEsportsPool: true }),
            makeMap({ mapId: 1, name: "Ancient", isEsportsPool: true }),
        ]

        expect(selectFeaturedMap(maps)?.name).toBe("Ancient")
    })

    test("falls back to the first map sorted by name", () => {
        const maps = [
            makeMap({ mapId: 2, name: "Nuke" }),
            makeMap({ mapId: 1, name: "Mirage" }),
        ]

        expect(selectFeaturedMap(maps)?.name).toBe("Mirage")
    })

    test("returns no featured map when map data is empty", () => {
        expect(selectFeaturedMap()).toBeUndefined()
        expect(selectFeaturedMap([])).toBeUndefined()
    })

    test("sorts selected-map recent lineups newest first", () => {
        const mapPage: MapPageModel = {
            ...makeMap({ mapId: 1, name: "Mirage" }),
            mapLineups: [
                makeLineup({
                    grenadeId: 1,
                    createdAt: "2026-01-01T00:00:00Z",
                }),
                makeLineup({
                    grenadeId: 2,
                    createdAt: "2026-03-01T00:00:00Z",
                }),
                makeLineup({
                    grenadeId: 3,
                    createdAt: "2026-02-01T00:00:00Z",
                }),
            ],
        }

        expect(
            selectRecentLineups(mapPage).map((lineup) => lineup.grenadeId)
        ).toEqual([2, 3, 1])
    })

    test("returns an empty recent lineup list without selected-map lineups", () => {
        expect(selectRecentLineups()).toEqual([])
        expect(
            selectRecentLineups({
                ...makeMap({ mapId: 1, name: "Mirage" }),
                mapLineups: [],
            })
        ).toEqual([])
    })
})
