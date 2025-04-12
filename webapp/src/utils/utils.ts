export function truncateAddress(address: string): string {
    if (!address) return ''
    return `${address.slice(0, 6)}......${address.slice(-4)}`
}

export function toChessApiUrl(url: string): string | null {
    try {
        const parsed = new URL(url)
        const parts = parsed.pathname.split('/').filter(Boolean)

        if (parts.length >= 2 && parts[0] === 'tournament') {
            const slug = parts[1]
            return `https://api.chess.com/pub/tournament/${slug}`
        }

        return null
    } catch (err) {
        return null
    }
}

export function extractTournamentSlug(url: string): string | null {
    try {
        const parsed = new URL(url)
        const parts = parsed.pathname.split('/').filter(Boolean)

        if (parts.length >= 2 && parts[0] === 'tournament') {
            return parts[1]
        }

        return null
    } catch (err) {
        return null
    }
}