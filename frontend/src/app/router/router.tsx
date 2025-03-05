import { Layout } from "../layout"
import { Homepage } from "@pages/home-page"
import { GrenadesList } from "@widgets/grenades-list"
import { createBrowserRouter } from "react-router-dom"

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Layout />,
            errorElement: (
                <div>Oups... Cant find that page or something is broken</div>
            ),
            children: [
                {
                    path: "/",
                    element: <Homepage />,
                },
                {
                    path: "grenades",
                    element: <GrenadesList />,
                },
            ],
        },
    ],
    {
        future: {
            v7_relativeSplatPath: true,
        },
    }
)
