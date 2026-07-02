import { describe, expect, test } from "vitest"
import { mapPageDTOschema } from "../model/domain"
import { fromMapPageDTO } from "./dto-transformer"

describe("map dto transformer", () => {
    test("treats nullable map_lineups from backend as an empty list", () => {
        const dto = mapPageDTOschema.parse({
            map_id: 1,
            name: "Mirage",
            link: null,
            image_link: null,
            map_lineups: null,
        })

        expect(fromMapPageDTO(dto).mapLineups).toEqual([])
    })
})
