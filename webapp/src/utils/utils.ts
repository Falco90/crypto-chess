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

export function toChessPageUrl(apiUrl: string): string | null {
    try {
        const parsed = new URL(apiUrl)
        const parts = parsed.pathname.split('/').filter(Boolean)

        if (parsed.hostname === 'api.chess.com' && parts[0] === 'pub' && parts[1] === 'tournament' && parts.length === 3) {
            const slug = parts[2]
            return `https://www.chess.com/tournament/${slug}`
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

export function formatApiData(input: string): string {
    return input
      .split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function formatTournamentName(input: string): string {
    return input
      .split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}