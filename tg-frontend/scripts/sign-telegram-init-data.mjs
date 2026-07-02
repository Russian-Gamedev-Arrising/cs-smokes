import crypto from "node:crypto"

const token = process.env.TOKEN ?? process.env.BOT_TOKEN

if (!token) {
    console.error("TOKEN or BOT_TOKEN is required")
    process.exit(1)
}

const user = {
    id: Number(process.env.TG_USER_ID ?? 111111),
    first_name: process.env.TG_FIRST_NAME ?? "QA",
    last_name: process.env.TG_LAST_NAME ?? "Player",
    username: process.env.TG_USERNAME ?? "qa_player",
}
const authDate = process.env.TG_AUTH_DATE ?? String(Math.floor(Date.now() / 1000))
const params = new URLSearchParams({
    auth_date: authDate,
    query_id: process.env.TG_QUERY_ID ?? "codex-tactical-qa",
    user: JSON.stringify(user),
})
const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")
const secret = crypto
    .createHmac("sha256", "WebAppData")
    .update(token)
    .digest()
const hash = crypto
    .createHmac("sha256", secret)
    .update(dataCheckString)
    .digest("hex")

params.set("hash", hash)
console.log(params.toString())
