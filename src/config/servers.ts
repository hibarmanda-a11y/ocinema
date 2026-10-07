/**
 * Streaming Server Configuration
 * 
 * Configure your own embed servers here.
 * Use placeholders: {tmdbId}, {season}, {episode}, {themeColor}
 */

export interface StreamingServer {
    id: string
    name: string
    description: string
    isActive: boolean
    // URL templates - use placeholders that will be replaced at runtime
    movieUrlTemplate: string
    tvUrlTemplate: string
    // Whether this server supports theme colors
    supportsThemeColor?: boolean
}

// Get logo URL from environment or leave empty
const LOGO_URL = import.meta.env.VITE_LOGO_URL || ''

// Helper to build logo parameter if configured
const logoParam = LOGO_URL ? `&logo=${encodeURIComponent(LOGO_URL)}` : ''

/**
 * Default streaming servers configuration
 * 
 * The placeholders will be replaced at runtime:
 * - {tmdbId} - The TMDB movie/show ID
 * - {season} - Season number (TV shows only)
 * - {episode} - Episode number (TV shows only)  
 * - {themeColor} - Current theme color in hex (without #)
 */
export const STREAMING_SERVERS: StreamingServer[] = [
    {
        id: 'server1',
        name: 'Server 1 (VidFast)',
        description: 'Fast streaming server',
        isActive: true,
        movieUrlTemplate: 'https://vidfast.pro/movie/{tmdbId}',
        tvUrlTemplate: 'https://vidfast.pro/tv/{tmdbId}/{season}/{episode}',
        supportsThemeColor: false,
    },
    {
        id: 'server2',
        name: 'Server 2 (VidLink)',
        description: 'Alternative streaming server',
        isActive: true,
        movieUrlTemplate: 'https://vidlink.pro/movie/{tmdbId}',
        tvUrlTemplate: 'https://vidlink.pro/tv/{tmdbId}/{season}/{episode}',
        supportsThemeColor: false,
    },
    {
        id: 'server3',
        name: 'Server 3 (VidSrc.to)',
        description: 'Backup streaming server',
        isActive: true,
        movieUrlTemplate: 'https://vidsrc.to/embed/movie/{tmdbId}',
        tvUrlTemplate: 'https://vidsrc.to/embed/tv/{tmdbId}/{season}/{episode}',
        supportsThemeColor: false,
    },
]

/**
 * Build a movie URL from a server template
 */
export const buildMovieUrl = (
    server: StreamingServer,
    tmdbId: number,
    themeColor: string
): string => {
    return server.movieUrlTemplate
        .replace('{tmdbId}', String(tmdbId))
        .replace('{themeColor}', themeColor)
        + (server.supportsThemeColor && LOGO_URL ? logoParam : '')
}

/**
 * Build a TV show URL from a server template
 */
export const buildTVUrl = (
    server: StreamingServer,
    tmdbId: number,
    season: number,
    episode: number,
    themeColor: string
): string => {
    return server.tvUrlTemplate
        .replace('{tmdbId}', String(tmdbId))
        .replace('{season}', String(season))
        .replace('{episode}', String(episode))
        .replace('{themeColor}', themeColor)
        + (server.supportsThemeColor && LOGO_URL ? logoParam : '')
}