import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaArrowLeft, FaSort } from 'react-icons/fa'
import { MediaCard } from '../components/MediaCard'
import { SkeletonCard } from '../components/SkeletonCard'
import {
  fetchTrendingMoviesPaginated,
  fetchPopularMoviesPaginated,
  fetchTopRatedMoviesPaginated,
  fetchNowPlayingMoviesPaginated,
  fetchTrendingTVShowsPaginated,
  fetchPopularTVShowsPaginated,
  fetchTopRatedTVShowsPaginated,
} from '../services/tmdbPaginated'
import { fetchLatestHindiMovies } from '../services/tmdb'
import type { Movie, TMDBResponse, TVShow } from '../types/tmdb'

type CategoryMedia = Movie | TVShow
type CategoryResponse = TMDBResponse<CategoryMedia>

interface LegacyCategoryConfig {
  title: string
  fetchFn: (page: number, sortBy?: string) => Promise<CategoryResponse>
  mediaType: 'movie' | 'tv'
  supportsSorting: boolean
}

interface PagedCategoryConfig {
  title: string
  description: string
  mediaType: 'movie' | 'tv'
  fetchFn: (page: number) => Promise<CategoryResponse>
}

const categoryConfig: Record<string, LegacyCategoryConfig> = {
  'trending-movies': {
    title: 'Trending Movies',
    fetchFn: fetchTrendingMoviesPaginated,
    mediaType: 'movie',
    supportsSorting: false,
  },
  'popular-movies': {
    title: 'Popular Movies',
    fetchFn: fetchPopularMoviesPaginated,
    mediaType: 'movie',
    supportsSorting: true,
  },
  'top-rated-movies': {
    title: 'Top Rated Movies',
    fetchFn: fetchTopRatedMoviesPaginated,
    mediaType: 'movie',
    supportsSorting: true,
  },
  'now-playing': {
    title: 'Now Playing',
    fetchFn: fetchNowPlayingMoviesPaginated,
    mediaType: 'movie',
    supportsSorting: true,
  },
  'trending-tv': {
    title: 'Trending TV Shows',
    fetchFn: fetchTrendingTVShowsPaginated,
    mediaType: 'tv',
    supportsSorting: false,
  },
  'popular-tv': {
    title: 'Popular TV Shows',
    fetchFn: fetchPopularTVShowsPaginated,
    mediaType: 'tv',
    supportsSorting: true,
  },
  'top-rated-tv': {
    title: 'Top Rated TV Shows',
    fetchFn: fetchTopRatedTVShowsPaginated,
    mediaType: 'tv',
    supportsSorting: true,
  },
}

const pagedCategoryConfig: Record<string, PagedCategoryConfig> = {
  indian: {
    title: 'Latest Indian Movies',
    description: 'The latest Hindi-language movie releases',
    mediaType: 'movie',
    fetchFn: async page => {
      const results = await fetchLatestHindiMovies(page)
      return {
        page,
        results,
        total_pages: results.length >= 20 ? page + 1 : page,
        total_results: results.length,
      }
    },
  },
  'web-series': {
    title: 'Popular Web Series',
    description: 'Popular television and streaming series',
    mediaType: 'tv',
    fetchFn: fetchPopularTVShowsPaginated,
  },
  'mcu-hollywood': {
    title: 'Popular Hollywood Movies',
    description: 'Popular movies from Hollywood',
    mediaType: 'movie',
    fetchFn: fetchPopularMoviesPaginated,
  },
}

const sortOptions = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
  { value: 'title.asc', label: 'A-Z' },
  { value: 'title.desc', label: 'Z-A' },
]

const PagedCategoryPage = ({ category }: { category: string }) => {
  const config = pagedCategoryConfig[category]
  const [items, setItems] = useState<CategoryMedia[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [reloadCount, setReloadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCurrentRequest = true

    const loadPage = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await config.fetchFn(page)
        if (!isCurrentRequest) return
        setItems(response.results)
        setTotalPages(response.total_pages)
      } catch (loadError) {
        if (!isCurrentRequest) return
        console.error(`Failed to load ${config.title.toLowerCase()}:`, loadError)
        setError(`Could not load ${config.title.toLowerCase()}. Please try again.`)
      } finally {
        if (isCurrentRequest) setLoading(false)
      }
    }

    loadPage()
    return () => {
      isCurrentRequest = false
    }
  }, [category, config, page, reloadCount])

  return (
    <div className="min-h-screen pt-20 md:pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-primary transition-colors mb-4"
          >
            <FaArrowLeft />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient">
            {config.title}
          </h1>
          <p className="text-sm md:text-base text-gray-400 mt-2">{config.description}</p>
        </div>

        {error && (
          <div className="text-center py-8 text-red-300" role="alert">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => setReloadCount(count => count + 1)}
              className="mt-3 rounded-lg border border-red-400/40 px-4 py-2 hover:bg-red-500/10"
            >
              Retry
            </button>
          </div>
        )}

        {!error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
            {loading ? (
              [...Array(15)].map((_, index) => <SkeletonCard key={index} />)
            ) : items.length > 0 ? (
              items.map(item => (
                <MediaCard
                  key={item.id}
                  item={item}
                  mediaType={config.mediaType}
                />
              ))
            ) : (
              <p className="col-span-full py-12 text-center text-gray-400">
                No titles were found for this page.
              </p>
            )}
          </div>
        )}

        {!error && !loading && items.length > 0 && (
          <nav
            className="mt-8 flex items-center justify-center gap-3"
            aria-label={`${config.title} pages`}
          >
            <button
              type="button"
              onClick={() => setPage(currentPage => Math.max(1, currentPage - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-3 py-2 text-sm text-gray-300" aria-live="polite">
              Page {page}
            </span>
            <button
              type="button"
              onClick={() => setPage(currentPage => currentPage + 1)}
              disabled={page >= totalPages}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}

const LegacyCategoryPage = ({ category }: { category: string | undefined }) => {
  const [items, setItems] = useState<CategoryMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [sortBy, setSortBy] = useState('popularity.desc')
  const observerTarget = useRef<HTMLDivElement>(null)
  const config = category ? categoryConfig[category] : null

  useEffect(() => {
    let isCurrentRequest = true

    const loadInitialContent = async () => {
      if (!config) return

      setLoading(true)
      setPage(1)
      setHasMore(true)
      try {
        const response = await config.fetchFn(
          1,
          config.supportsSorting ? sortBy : undefined
        )
        if (!isCurrentRequest) return
        setItems(response.results)
        setHasMore(response.page < response.total_pages)
      } catch (loadError) {
        if (isCurrentRequest) {
          console.error('Failed to load category content:', loadError)
        }
      } finally {
        if (isCurrentRequest) setLoading(false)
      }
    }

    loadInitialContent()
    return () => {
      isCurrentRequest = false
    }
  }, [category, config, sortBy])

  const loadMore = useCallback(async () => {
    if (!config || loadingMore || !hasMore) return

    setLoadingMore(true)
    try {
      const response = await config.fetchFn(
        page + 1,
        config.supportsSorting ? sortBy : undefined
      )
      setItems(previousItems => [...previousItems, ...response.results])
      setPage(currentPage => currentPage + 1)
      setHasMore(response.page < response.total_pages)
    } catch (loadError) {
      console.error('Failed to load more category content:', loadError)
    } finally {
      setLoadingMore(false)
    }
  }, [config, hasMore, loadingMore, page, sortBy])

  useEffect(() => {
    if (!hasMore || loadingMore || loading) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) loadMore()
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    const target = observerTarget.current
    if (target) observer.observe(target)
    return () => {
      if (target) observer.unobserve(target)
    }
  }, [hasMore, loadingMore, loading, loadMore])

  if (!config) return <div className="text-center py-20">Category not found</div>

  return (
    <div className="min-h-screen pt-20 md:pt-24 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-primary transition-colors mb-4"
          >
            <FaArrowLeft />
            <span>Back to Home</span>
          </Link>
          {loading ? (
            <>
              <div className="h-10 md:h-12 bg-gray-700/50 rounded w-64 mb-2 shimmer" />
              <div className="h-4 md:h-5 bg-gray-700/50 rounded w-48 shimmer" />
            </>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient">
                  {config.title}
                </h1>
                <p className="text-sm md:text-base text-gray-400 mt-2">
                  {items.length} {config.mediaType === 'movie' ? 'movies' : 'shows'} available
                </p>
              </div>
              {config.supportsSorting && (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <FaSort className="text-primary text-lg" />
                  <select
                    value={sortBy}
                    onChange={event => setSortBy(event.target.value)}
                    className="glass-effect rounded-lg px-3 md:px-4 py-2 md:py-2.5 font-semibold text-sm md:text-base border border-white/10 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 cursor-pointer bg-gray-800/50"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value} className="bg-gray-900">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
          {loading ? (
            [...Array(18)].map((_, index) => <SkeletonCard key={index} />)
          ) : (
            items.map(item => (
              <MediaCard key={item.id} item={item} mediaType={config.mediaType} />
            ))
          )}
        </div>

        {loadingMore && (
          <div className="flex justify-center mt-8 md:mt-12">
            <div className="flex items-center space-x-3 text-gray-400">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span>Loading more...</span>
            </div>
          </div>
        )}

        {hasMore && !loadingMore && !loading && (
          <div ref={observerTarget} className="h-20 w-full" aria-hidden="true" />
        )}

        {!hasMore && items.length > 0 && (
          <div className="text-center mt-8 md:mt-12 text-gray-400">
            <p>You've reached the end! 🎬</p>
          </div>
        )}
      </div>
    </div>
  )
}

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>()

  if (category && pagedCategoryConfig[category]) {
    return <PagedCategoryPage key={category} category={category} />
  }

  return <LegacyCategoryPage category={category} />
}

export default CategoryPage
