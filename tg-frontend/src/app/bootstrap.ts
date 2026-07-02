const loadTelegramSdk = () =>
    new Promise((resolve, reject) => {
        const telegramSdk = document.createElement("script")

        telegramSdk.src = "https://telegram.org/js/telegram-web-app.js?56"
        telegramSdk.onload = resolve
        telegramSdk.onerror = reject

        document.head.append(telegramSdk)
    })

const bootApp = async () => {
    if (import.meta.env.VITE_IN_TG_ENVIRONMENT === "true") {
        await loadTelegramSdk()
    }

    await import("./main")
}

bootApp().catch((error) => {
    console.error(error)

    const message =
        error instanceof Error ? error.message : "script load failed"

    document.getElementById("root")!.textContent =
        `Application failed to start: ${message}`
})
