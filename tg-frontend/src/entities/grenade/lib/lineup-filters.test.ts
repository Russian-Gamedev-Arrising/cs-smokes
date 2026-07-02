import { describe, expect, test } from "vitest"
import { GrenadeModel } from "../model/domain"
import {
    filterLineups,
    getLineupGrenadeClasses,
    getLineupPropertyChips,
    selectLineups,
    sortLineups,
} from "./lineup-filters"

const makeLineup = (
    overrides: Partial<GrenadeModel> & Pick<GrenadeModel, "grenadeId">
) => {
    const { grenadeId, ...rest } = overrides
    const baseLineup: GrenadeModel = {
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
        createdAt: "2026-01-01T10:00:00Z",
        title: "Default lineup",
        description: null,
        isApproved: false,
        isFavorite: false,
        views: 0,
        previewImageLink: null,
        request: {
            request_id: null,
            status: "WAITING FOR CREATION",
        },
    }

    return {
        ...baseLineup,
        ...rest,
    }
}

const lineups: GrenadeModel[] = [
    makeLineup({
        grenadeId: 1,
        title: "Mirage window smoke",
        description: "Blocks catwalk vision",
        creator: {
            userId: 1,
            username: "smokeMaster",
            avatarUrl: null,
            firstName: null,
            lastName: null,
        },
        grenadeClass: {
            grenadeClassId: 1,
            name: "Smoke",
            description: "Blocks vision",
            price: 300,
        },
        propertyList: [
            { propertyId: 1, name: "tickrate", value: "64" },
            { propertyId: 2, name: "jumpthrow", value: "yes" },
        ],
        createdAt: "2026-01-03T10:00:00Z",
        isApproved: true,
        isFavorite: true,
        views: 50,
        request: { request_id: 10, status: "OPEN" },
    }),
    makeLineup({
        grenadeId: 2,
        title: "Inferno banana flash",
        description: "Pop flash for top banana",
        creator: {
            userId: 2,
            username: "flashLead",
            avatarUrl: null,
            firstName: null,
            lastName: null,
        },
        grenadeClass: {
            grenadeClassId: 2,
            name: "Flashbang",
            description: "Blinds enemies",
            price: 200,
        },
        propertyList: [{ propertyId: 3, name: "one-way", value: "no" }],
        createdAt: "2026-01-01T10:00:00Z",
        isApproved: false,
        isFavorite: false,
        views: 90,
        request: { request_id: 11, status: "REJECTED" },
    }),
    makeLineup({
        grenadeId: 3,
        title: "Ancient cave molotov",
        description: null,
        grenadeClass: {
            grenadeClassId: 3,
            name: "Molotov",
            description: "Burns area",
            price: 400,
        },
        createdAt: "2026-01-02T10:00:00Z",
        views: 20,
        request: { request_id: null, status: "WAITING FOR CREATION" },
    }),
]

describe("lineup filters", () => {
    test("searches title, description, creator, grenade class and properties", () => {
        expect(filterLineups(lineups, { query: "catwalk" })).toHaveLength(1)
        expect(
            filterLineups(lineups, { query: "flashLead" })[0].grenadeId
        ).toBe(2)
        expect(filterLineups(lineups, { query: "molotov" })[0].grenadeId).toBe(
            3
        )
        expect(
            filterLineups(lineups, { query: "jumpthrow yes" })[0].grenadeId
        ).toBe(1)
    })

    test("filters by grenade class, approval, favorite and request status", () => {
        expect(filterLineups(lineups, { grenadeClassId: 2 })[0].grenadeId).toBe(
            2
        )
        expect(
            filterLineups(lineups, { grenadeClassName: "Smoke" })[0].grenadeId
        ).toBe(1)
        expect(filterLineups(lineups, { isApproved: true })[0].grenadeId).toBe(
            1
        )
        expect(filterLineups(lineups, { isFavorite: false })).toHaveLength(2)
        expect(
            filterLineups(lineups, { requestStatus: "REJECTED" })[0].grenadeId
        ).toBe(2)
    })

    test("filters by property chips and returns no-result arrays", () => {
        expect(
            filterLineups(lineups, { propertyChips: ["tickrate:64"] })[0]
                .grenadeId
        ).toBe(1)
        expect(
            filterLineups(lineups, { propertyChips: ["one-way", "no"] })[0]
                .grenadeId
        ).toBe(2)
        expect(filterLineups(lineups, { query: "not in data" })).toEqual([])
    })

    test("sorts by date, title and views in both directions", () => {
        expect(
            sortLineups(lineups, "createdAtDesc").map(
                (lineup) => lineup.grenadeId
            )
        ).toEqual([1, 3, 2])
        expect(
            sortLineups(lineups, "createdAtAsc").map(
                (lineup) => lineup.grenadeId
            )
        ).toEqual([2, 3, 1])
        expect(
            sortLineups(lineups, "titleAsc").map((lineup) => lineup.grenadeId)
        ).toEqual([3, 2, 1])
        expect(
            sortLineups(lineups, "titleDesc").map((lineup) => lineup.grenadeId)
        ).toEqual([1, 2, 3])
        expect(
            sortLineups(lineups, "viewsDesc").map((lineup) => lineup.grenadeId)
        ).toEqual([2, 1, 3])
        expect(
            sortLineups(lineups, "viewsAsc").map((lineup) => lineup.grenadeId)
        ).toEqual([3, 1, 2])
    })

    test("selects filtered and sorted lineups without mutating input", () => {
        const selected = selectLineups(lineups, {
            isFavorite: false,
            sort: "viewsDesc",
        })

        expect(selected.map((lineup) => lineup.grenadeId)).toEqual([2, 3])
        expect(lineups.map((lineup) => lineup.grenadeId)).toEqual([1, 2, 3])
    })

    test("returns deterministic available property chips and classes", () => {
        expect(getLineupPropertyChips(lineups)).toEqual([
            "jumpthrow:yes",
            "one-way:no",
            "tickrate:64",
        ])
        expect(
            getLineupGrenadeClasses(lineups).map(
                (grenadeClass) => grenadeClass.name
            )
        ).toEqual(["Flashbang", "Molotov", "Smoke"])
    })
})
