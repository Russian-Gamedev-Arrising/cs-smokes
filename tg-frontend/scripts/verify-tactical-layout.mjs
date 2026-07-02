import fs from "node:fs/promises"
import path from "node:path"
import { chromium } from "playwright"

const frontendUrl = (process.env.FRONTEND_URL ?? "http://localhost:8000").replace(
    /\/$/,
    ""
)
const mapPath = process.env.TACTICAL_MAP_PATH ?? "/maps/1/grenades"
const outputDir =
    process.env.TACTICAL_SCREENSHOT_DIR ??
    path.resolve(process.cwd(), "artifacts", "tactical-layout")
const viewports = [
    { width: 360, height: 760 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 960 },
]

await fs.mkdir(outputDir, { recursive: true })

const browser = await chromium.launch()
const results = []

try {
    for (const viewport of viewports) {
        const page = await browser.newPage({ viewport })
        await page.goto(`${frontendUrl}${mapPath}`, {
            waitUntil: "domcontentloaded",
        })
        await page.getByText("Window smoke").waitFor({ timeout: 15000 })
        const screenshotPath = path.join(
            outputDir,
            `map-${viewport.width}x${viewport.height}.png`
        )

        await page.screenshot({ path: screenshotPath, fullPage: true })

        const geometry = await page.evaluate(() => {
            const search = document.querySelector(
                'input[aria-label="Search lineups"]'
            )
            const addLink = Array.from(document.querySelectorAll("a")).find(
                (element) => element.textContent?.includes("Add lineup")
            )
            const cards = document.querySelectorAll('[aria-label="card"]')
            const text = document.body.innerText

            return {
                hasSearch: Boolean(search),
                hasAddLineup: Boolean(addLink),
                cardCount: cards.length,
                hasMirage: text.includes("Mirage"),
                hasWindowSmoke: text.includes("Window smoke"),
                hasRampFlash: text.includes("A ramp flash"),
                hasBenchMolotov: text.includes("Bench molotov"),
                bodyWidth: document.body.scrollWidth,
                viewportWidth: window.innerWidth,
            }
        })

        if (!geometry.hasSearch || !geometry.hasAddLineup) {
            throw new Error(
                `Toolbar controls missing at ${viewport.width}px: ${JSON.stringify(
                    geometry
                )}`
            )
        }

        if (
            geometry.cardCount === 0 ||
            !geometry.hasMirage ||
            !geometry.hasWindowSmoke ||
            !geometry.hasRampFlash ||
            !geometry.hasBenchMolotov
        ) {
            throw new Error(
                `Seeded tactical lineups missing at ${viewport.width}px: ${JSON.stringify(
                    geometry
                )}`
            )
        }

        if (geometry.bodyWidth > geometry.viewportWidth + 1) {
            throw new Error(
                `Horizontal overflow at ${viewport.width}px: ${JSON.stringify(
                    geometry
                )}`
            )
        }

        results.push({ viewport, screenshotPath, geometry })
        await page.close()
    }
} finally {
    await browser.close()
}

console.log(JSON.stringify(results, null, 2))
