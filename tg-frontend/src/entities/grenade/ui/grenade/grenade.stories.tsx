import { Meta, StoryObj } from "@storybook/react"
import { expect, within } from "@storybook/test"
import { Canvas } from "@storybook/core/types"
import { grenadeModelMock } from "../../model/__mocks__"
import { Grenade } from "./grenade"
import classes from "./grenade.stories.module.scss"

// To remove boilerplate all mocks collected to this object
const baseTestFunction = async (canvas: Canvas) => {
    const card = canvas.getByLabelText("card")

    const title = within(card).getByText(grenadeModelMock.title)
    const detailLink = within(card).getByRole("link", {
        name: `Open ${grenadeModelMock.title}`,
    })

    // Basic tests
    await expect(card).toBeInTheDocument()
    await expect(card).toBeVisible()

    // Title tests
    await expect(title).toBeInTheDocument()
    await expect(title).toBeVisible()
    await expect(detailLink).toHaveAttribute(
        "href",
        `/grenades/${grenadeModelMock.grenadeId}`
    )
}

const expectRequestState = async (canvas: Canvas, label: string) => {
    const card = canvas.getByLabelText("card")

    const labels = within(card).getAllByText(label)

    await expect(labels[labels.length - 1]).toBeVisible()
}

const meta: Meta<typeof Grenade> = {
    component: Grenade,
    args: {
        grenade: grenadeModelMock,
    },
    parameters: {
        layout: "centered",
    },
}

export default meta

type Story = StoryObj<typeof Grenade>

export const Default: Story = {
    play: async ({ canvas }) => {
        await baseTestFunction(canvas)
        await expectRequestState(canvas, "Rejected")
    },
}

export const OpenRequest: Story = {
    args: {
        grenade: {
            ...grenadeModelMock,
            request: { request_id: 12, status: "OPEN" },
        },
    },
    play: async ({ canvas }) => {
        await expectRequestState(canvas, "Open")
    },
}

export const WaitingRequest: Story = {
    args: {
        grenade: {
            ...grenadeModelMock,
            request: { request_id: null, status: "WAITING FOR CREATION" },
        },
    },
    play: async ({ canvas }) => {
        await expectRequestState(canvas, "No request")
    },
}

export const ApprovedRequest: Story = {
    args: {
        grenade: {
            ...grenadeModelMock,
            request: { request_id: 13, status: "APPROVED" },
        },
    },
    play: async ({ canvas }) => {
        await expectRequestState(canvas, "Approved")
    },
}

export const MergedRequest: Story = {
    args: {
        grenade: {
            ...grenadeModelMock,
            request: { request_id: 14, status: "MERGED" },
        },
    },
    play: async ({ canvas }) => {
        await expectRequestState(canvas, "Merged")
    },
}

export const ClosedRequest: Story = {
    args: {
        grenade: {
            ...grenadeModelMock,
            request: { request_id: 15, status: "CLOSED" },
        },
    },
    play: async ({ canvas }) => {
        await expectRequestState(canvas, "Closed")
    },
}

export const CustomClassName: Story = {
    args: {
        className: classes.testClass,
    },
    play: async ({ canvas }) => {
        await baseTestFunction(canvas)

        const card = canvas.getByLabelText("card")
        await expect(card).toHaveClass(classes.testClass)
    },
}
