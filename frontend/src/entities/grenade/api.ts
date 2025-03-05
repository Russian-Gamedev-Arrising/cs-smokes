import { queryOptions } from "@tanstack/react-query"
import { GrenadeModel } from "./domain"

// TODO: remove mock
const mockGrenades: GrenadeModel[] = [
    {
        grenade_id: 1,
        map_id: 1,
        grenade_class_id: 1,
        type_id: 1,
        link_to_video: "http://example.com/video1",
        user_id: 1,
        created_at: new Date(),
    },
    {
        grenade_id: 2,
        map_id: 2,
        grenade_class_id: 2,
        type_id: 2,
        link_to_video: "http://example.com/video2",
        user_id: 2,
        created_at: new Date(),
    },
]

export const api = {
    baseKey: "grenade",
    getGrenades: () =>
        queryOptions({
            queryKey: [api.baseKey, "list"],
            // queryFn: () =>
            //     typedQuery(instance.get("/grenades"), grenadeDTOSchema.array())
            //         .then(() => {})
            //         .catch((err) => {
            //             console.error(err)

            //             throw err
            //         }),
            // TODO: remove this placeholder
            queryFn: () =>
                Promise.resolve(mockGrenades).catch((err) => {
                    console.error(err)

                    throw err
                }),
        }),
    getGrenadeById: ({ grenadeId }: { grenadeId: number }) =>
        queryOptions({
            queryKey: [api.baseKey, "ById", grenadeId],
            // queryFn: () =>
            //     typedQuery(
            //         instance.get(`/grenades/${grenadeId}`),
            //         grenadeDTOSchema
            //     ),
            // TODO: remove this mock
            queryFn: () =>
                Promise.resolve(mockGrenades[grenadeId - 1]).catch((err) => {
                    console.error(err)

                    throw err
                }),
        }),
}
