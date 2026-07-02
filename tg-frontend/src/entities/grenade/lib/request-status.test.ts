import { describe, expect, test } from "vitest"
import {
    getRequestHref,
    getRequestStatusMeta,
    hasRequestDetailLink,
    REQUEST_STATUSES,
} from "./request-status"

describe("request status helpers", () => {
    test("covers every existing request status", () => {
        expect(REQUEST_STATUSES).toEqual([
            "WAITING FOR CREATION",
            "OPEN",
            "APPROVED",
            "REJECTED",
            "MERGED",
            "CLOSED",
        ])

        REQUEST_STATUSES.forEach((status) => {
            const meta = getRequestStatusMeta(status)

            expect(meta.status).toBe(status)
            expect(meta.label.length).toBeGreaterThan(0)
            expect(meta.shortLabel.length).toBeGreaterThan(0)
            expect(meta.description.length).toBeGreaterThan(0)
        })
    })

    test("maps statuses to stable badge tones", () => {
        expect(getRequestStatusMeta("WAITING FOR CREATION").tone).toBe(
            "disabled"
        )
        expect(getRequestStatusMeta("OPEN").tone).toBe("warning")
        expect(getRequestStatusMeta("APPROVED").tone).toBe("success")
        expect(getRequestStatusMeta("REJECTED").tone).toBe("danger")
        expect(getRequestStatusMeta("MERGED").tone).toBe("accent")
        expect(getRequestStatusMeta("CLOSED").tone).toBe("neutral")
    })

    test("links only when request id exists", () => {
        expect(getRequestHref({ request_id: 12, status: "OPEN" })).toBe(
            "/requests/12"
        )
        expect(hasRequestDetailLink({ request_id: 12, status: "OPEN" })).toBe(
            true
        )
        expect(
            getRequestHref({
                request_id: null,
                status: "WAITING FOR CREATION",
            })
        ).toBeNull()
        expect(hasRequestDetailLink(null)).toBe(false)
    })
})
