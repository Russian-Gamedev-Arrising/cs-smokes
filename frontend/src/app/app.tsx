import { RouterProvider } from "react-router-dom"
import "./tailwind.css"
import "./index.scss"
import { Provider } from "react-redux"
import { store } from "./store/store"
import { router } from "./router/router"
import { QueryClientProvider } from "@tanstack/react-query"
import { client } from "@shared/api"

export function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={client}>
                <RouterProvider router={router}></RouterProvider>
            </QueryClientProvider>
        </Provider>
    )
}
