import { spawnSync } from "node:child_process"

const backendUrl = (process.env.BACKEND_URL ?? "http://localhost:3000/api").replace(
    /\/$/,
    ""
)
const token = process.env.TOKEN ?? process.env.BOT_TOKEN
const initData =
    process.env.TG_INIT_DATA ??
    spawnSync(process.execPath, [new URL("./sign-telegram-init-data.mjs", import.meta.url).pathname], {
        env: { ...process.env, TOKEN: token ?? "" },
        encoding: "utf8",
    }).stdout.trim()

if (!initData) {
    console.error("TG_INIT_DATA or TOKEN/BOT_TOKEN is required")
    process.exit(1)
}

const request = async (path, init = {}) => {
    const response = await fetch(`${backendUrl}${path}`, init)

    if (!response.ok) {
        throw new Error(`${path} failed with ${response.status}`)
    }

    return response.json()
}

const auth = await request("/login/tg/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ init_data: initData }),
})
const headers = { authorization: `Bearer ${auth.access_token}` }
const maps = await request("/maps/", { headers })
const lineups = await request("/lineups", { headers })
let selectedMap = maps[0]
let selectedMapDetail = null
let selectedMapLineups = []

for (const map of maps) {
    const detail = await request(`/maps/${map.map_id}`, { headers })
    const detailLineups = detail.map_lineups ?? []
    const fallbackLineups = lineups.filter((lineup) => lineup.map_id === map.map_id)
    const mapLineups = detailLineups.length > 0 ? detailLineups : fallbackLineups

    if (!selectedMapDetail || mapLineups.length > 0) {
        selectedMap = map
        selectedMapDetail = detail
        selectedMapLineups = mapLineups
    }

    if (mapLineups.length > 0) {
        break
    }
}

const firstLineup = selectedMapLineups[0]

console.log(
    JSON.stringify(
        {
            frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:8000",
            initData,
            mapPath: selectedMap
                ? `/maps/${selectedMap.map_id}/grenades`
                : "/maps",
            homePath: "/",
            lineupPath: firstLineup
                ? `/grenades/${firstLineup.grenade_id}`
                : null,
            selectedMap,
            lineupCount: selectedMapLineups.length,
        },
        null,
        2
    )
)
