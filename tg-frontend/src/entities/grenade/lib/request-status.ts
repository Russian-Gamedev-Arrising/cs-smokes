import { GrenadeModel } from "../model/domain"

export type RequestStatus = GrenadeModel["request"]["status"]
export type RequestBadgeColor =
    | "accent"
    | "disabled"
    | "danger"
    | "success"
    | "warning"
    | "neutral"

export type RequestStatusMeta = {
    status: RequestStatus
    label: string
    shortLabel: string
    tone: RequestBadgeColor
    description: string
}

export const REQUEST_STATUSES: RequestStatus[] = [
    "WAITING FOR CREATION",
    "OPEN",
    "APPROVED",
    "REJECTED",
    "MERGED",
    "CLOSED",
]

const statusMeta: Record<RequestStatus, RequestStatusMeta> = {
    "WAITING FOR CREATION": {
        status: "WAITING FOR CREATION",
        label: "No request yet",
        shortLabel: "No request",
        tone: "disabled",
        description: "Moderation request has not been created.",
    },
    OPEN: {
        status: "OPEN",
        label: "Request open",
        shortLabel: "Open",
        tone: "warning",
        description: "Moderation request is waiting for review.",
    },
    APPROVED: {
        status: "APPROVED",
        label: "Request approved",
        shortLabel: "Approved",
        tone: "success",
        description: "Moderation request was approved.",
    },
    REJECTED: {
        status: "REJECTED",
        label: "Request rejected",
        shortLabel: "Rejected",
        tone: "danger",
        description: "Moderation request was rejected.",
    },
    MERGED: {
        status: "MERGED",
        label: "Request merged",
        shortLabel: "Merged",
        tone: "accent",
        description: "Moderation request was merged.",
    },
    CLOSED: {
        status: "CLOSED",
        label: "Request closed",
        shortLabel: "Closed",
        tone: "neutral",
        description: "Moderation request was closed.",
    },
}

export function getRequestStatusMeta(status: RequestStatus) {
    return statusMeta[status]
}

export function getRequestHref(
    request: GrenadeModel["request"] | null | undefined
) {
    if (!request?.request_id) {
        return null
    }

    return `/requests/${request.request_id}`
}

export function hasRequestDetailLink(
    request: GrenadeModel["request"] | null | undefined
) {
    return getRequestHref(request) !== null
}
