import { expect } from "@storybook/test"
import { Canvas } from "storybook/internal/types"
import { grenadeModelMock } from "../../model/__mocks__"

export const baseTestFunction = async (canvas: Canvas) => {
    const title = canvas.getByRole("heading", {
        level: 1,
        name: grenadeModelMock.title,
    })
    const creator = canvas.getByRole("link", {
        name: grenadeModelMock.creator.username,
    })
    const previewImage = canvas.getByRole("img")

    await expect(title).toBeInTheDocument()
    await expect(title).toBeVisible()

    await expect(creator).toBeInTheDocument()
    await expect(creator).toBeVisible()
    await expect(creator).toHaveAttribute(
        "href",
        `/guest/profile/${grenadeModelMock.creator.userId}`
    )

    await expect(previewImage).toBeInTheDocument()
    await expect(previewImage).toBeVisible()
    await expect(previewImage).toHaveAttribute(
        "src",
        grenadeModelMock.previewImageLink
    )
}

export const oppositeTestFunction = async (canvas: Canvas) => {
    const title = canvas.queryByRole("heading", { level: 1 })
    const creator = canvas.queryByRole("link", {
        name: grenadeModelMock.creator.username,
    })
    const grenadeType = canvas.queryByText(grenadeModelMock.grenadeClass.name)
    const previewImage = canvas.queryByRole("img")

    await expect(title).not.toBeInTheDocument()
    await expect(title).toBeNull()

    await expect(creator).not.toBeInTheDocument()
    await expect(creator).toBeNull()

    await expect(grenadeType).not.toBeInTheDocument()
    await expect(grenadeType).toBeNull()

    await expect(previewImage).not.toBeInTheDocument()
    await expect(previewImage).toBeNull()
}
