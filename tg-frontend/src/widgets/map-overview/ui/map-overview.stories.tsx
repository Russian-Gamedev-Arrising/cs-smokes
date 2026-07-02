import { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, waitFor } from "@storybook/test"
import { MapOverview } from "./map-overview"
import { mockMapPage, testMapPageServer } from "@entities/map/dev"
import { testGrenadeServer } from "@entities/grenade/dev"

const mockMapLineups = mockMapPage.map_lineups ?? []

const meta: Meta<typeof MapOverview> = {
    component: MapOverview,
    parameters: {
        reactQueryDevTools: true,
        msw: {
            handlers: [
                // Map
                testMapPageServer({
                    mapId: mockMapPage.map_id,
                    delayInMs: 300,
                }),
                // Grenades
                testGrenadeServer({
                    grenadeId: mockMapLineups[0].grenade_id,
                    customData: mockMapLineups[0],
                    delayInMs: 200,
                }),
                testGrenadeServer({
                    grenadeId: mockMapLineups[1].grenade_id,
                    customData: mockMapLineups[1],
                    delayInMs: 250,
                }),
            ],
        },
        layout: "centered",
    },
    args: {
        mapId: mockMapPage.map_id,
    },
    play: async ({ canvas }) => {
        const loaderPlaceholder = await canvas.findAllByLabelText(
            "placeholder-skeleton"
        )

        await expect(loaderPlaceholder).toHaveLength(15)
        await expect(loaderPlaceholder[0]).toBeInTheDocument()
        await expect(loaderPlaceholder[0]).toBeVisible()

        // Waiting for the end of the request
        const title = await canvas.findByRole(
            "heading",
            { level: 1 },
            {
                timeout: 2000,
            }
        )

        await expect(title).toHaveTextContent(mockMapPage.name)
        await expect(title).toBeVisible()

        await expect(await canvas.findByText("Mid Control Smoke")).toBeVisible()
        await expect(
            await canvas.findByText("One-Way Smoke on Mirage")
        ).toBeVisible()

        const sortSelect = canvas.getByLabelText("Sort")
        await userEvent.selectOptions(sortSelect, "titleDesc")
        await waitFor(() => {
            const cards = canvas.getAllByLabelText("card")

            expect(cards[0]).toHaveTextContent("One-Way Smoke on Mirage")
            expect(cards[1]).toHaveTextContent("Mid Control Smoke")
        })

        const searchInput = canvas.getByLabelText("Search lineups")
        await userEvent.type(searchInput, "does-not-exist")
        await expect(
            await canvas.findByText("No lineups match these controls")
        ).toBeVisible()

        await userEvent.click(canvas.getByRole("button", { name: "Reset" }))
        await waitFor(() => {
            expect(canvas.getByText("Mid Control Smoke")).toBeVisible()
            expect(canvas.getByText("One-Way Smoke on Mirage")).toBeVisible()
        })
    },
}

export default meta

type Story = StoryObj<typeof MapOverview>

export const Default: Story = {}
