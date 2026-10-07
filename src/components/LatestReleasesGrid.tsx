import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaChevronLeft, FaChevronRight, FaFire } from 'react-icons/fa'
import { getImageUrl } from '../services/tmdb'
import { fetchNowPlayingMoviesPaginated } from '../services/tmdbPaginated'
import { formatDistanceToNow } from '../utils/formatters'
import type { Movie } from '../types/tmdb'

interface LatestReleasesGridProps {
  title?: string
}

export const LatestReleasesGrid = ({
  title = 'Latest Releases',
}: LatestReleasesGridProps) => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchNowPlayingMoviesPaginated(page)
        // প্রতি পেজে সবসময় ২০টি মুভি (৫ কলাম × ৪ সারি)
        setMovies(data.results.slice(0, 20))
        setTotalPages(Math.min(data.total_pages || 1, 20))
      } catch (error) {
        console.error('Failed to load latest releases:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page])

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
    document.getElementById('latest-releases')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const getReleaseDate = (dateString: string): Date => {
    if (!dateString) return new Date()
    return new Date(dateString)
  }

  return (
    <section id="latest-releases" className="w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-red-700 rounded-full" />
          <FaFire className="text-red-500 text-xl" />
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {title}
          </h2>
        </div>

        {/* Grid — বড় ডিভাইসে ৫ কলাম */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 lg:gap-6">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[2/3] rounded-lg bg-white/5 animate-pulse" />
                <div className="h-4 bg-white/5 rounded animate-pulse" />
                <div className="h-3 w-2/3 bg-white/5 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 lg:gap-6">
            {movies.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="group block"
              >
                {/* Poster — বড় ডিভাইসে বড় সাইজ */}
                <div className="relative aspect-[2/3] rounded-lg lg:rounded-xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-red-600/60 transition-all duration-300">
                  <img
                    src={getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Top Left Trending Tag */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 bg-red-600 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded">
                      Trending
                    </span>
                  </div>

                  {/* Top Right Quality Tag */}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-white/20 text-white text-[9px] sm:text-[10px] font-semibold rounded">
                      WEB-DL
                    </span>
                  </div>

                  {/* Rating Badge */}
                  {movie.vote_average > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-yellow-400 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                      <FaStar className="text-[8px]" />
                      {movie.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="mt-2 lg:mt-3 space-y-1">
                  <h3 className="text-sm lg:text-base font-semibold text-white line-clamp-2 group-hover:text-red-500 transition-colors leading-tight">
                    {movie.title}
                  </h3>
                  <p className="text-[11px] lg:text-xs text-gray-500 line-clamp-1">
                    English WEB-DL 480p, 720p &amp; 1080p
                  </p>
                  <p className="text-[11px] lg:text-xs text-gray-400 font-medium">
                    {formatDistanceToNow(getReleaseDate(movie.release_date))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-600 border border-white/10 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5"
              aria-label="Previous page"
            >
              <FaChevronLeft className="text-xs" />
              Prev
            </button>

            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (page <= 3) {
                  pageNum = i + 1
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = page - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                      pageNum === page
                        ? 'bg-red-600 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-red-600 border border-white/10 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5"
              aria-label="Next page"
            >
              Next
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}