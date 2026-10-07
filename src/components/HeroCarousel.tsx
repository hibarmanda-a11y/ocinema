// import { useEffect, useRef, useState } from 'react'
// import { Link } from 'react-router-dom'
// import {
//   FaChevronLeft,
//   FaChevronRight,
//   FaStar,
//   FaPlay,
//   FaInfoCircle,
//   FaCalendarAlt,
// } from 'react-icons/fa'
// import { getImageUrl } from '../services/tmdb'
// import type { Movie } from '../types/tmdb'

// interface HeroCarouselProps {
//   title: string
//   movies: Movie[]
//   loading?: boolean
//   /** 'featured' = বড় হিরো ব্যানার | 'row' = হরাইজন্টাল স্ক্রল */
//   variant?: 'featured' | 'row'
// }

// /* ==================== Featured Hero Banner (Big Auto-Change) ==================== */
// const FeaturedHero = ({
//   title,
//   movies,
// }: {
//   title: string
//   movies: Movie[]
// }) => {
//   const [index, setIndex] = useState(0)
//   const [paused, setPaused] = useState(false)

//   useEffect(() => {
//     if (paused || movies.length === 0) return
//     const t = setInterval(() => {
//       setIndex((p) => (p + 1) % Math.min(movies.length, 10))
//     }, 6000)
//     return () => clearInterval(t)
//   }, [paused, movies.length])

//   if (!movies.length) return null

//   const movie = movies[index]
//   const total = Math.min(movies.length, 10)

//   const next = () => setIndex((p) => (p + 1) % total)
//   const prev = () => setIndex((p) => (p - 1 + total) % total)

//   return (
//     <section
//       className="relative w-full mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-8"
//       onMouseEnter={() => setPaused(true)}
//       onMouseLeave={() => setPaused(false)}
//       aria-label={title}
//     >
//       <div className="relative rounded-2xl overflow-hidden border border-red-900/40 shadow-2xl shadow-red-900/20">
//         {/* Backdrop */}
//         <div className="relative h-[380px] sm:h-[440px] md:h-[520px] lg:h-[600px] w-full">
//           <img
//             key={movie.id}
//             src={getImageUrl(movie.backdrop_path, 'original')}
//             alt={movie.title}
//             className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
//             loading="eager"
//           />

//           {/* Gradient overlays */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
//           <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

//           {/* Top Right Badges */}
//           <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
//             <span className="px-3 py-1 rounded bg-red-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider">
//               Featured
//             </span>
//             <span className="px-3 py-1 rounded bg-black/70 backdrop-blur-sm border border-white/20 text-white text-[10px] sm:text-xs font-semibold">
//               Dual Audio
//             </span>
//           </div>

//           {/* Content */}
//           <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-12 z-10">
//             <div className="max-w-3xl">
//               {/* Title */}
//               <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight drop-shadow-2xl mb-4 uppercase tracking-wide">
//                 {movie.title}
//               </h1>

//               {/* Meta row */}
//               <div className="flex flex-wrap items-center gap-3 mb-5">
//                 <span className="px-2 py-0.5 rounded border border-white/40 text-white text-xs font-bold">
//                   HD
//                 </span>
//                 <span className="flex items-center gap-1.5 text-gray-300 text-sm">
//                   <FaCalendarAlt className="text-xs" />
//                   {movie.release_date
//                     ? new Date(movie.release_date).toLocaleDateString('en-US', {
//                         month: 'short',
//                         year: 'numeric',
//                       })
//                     : 'Coming Soon'}
//                 </span>
//                 <span className="flex items-center gap-1.5 text-yellow-400 text-sm font-bold">
//                   <FaStar className="text-xs" />
//                   {movie.vote_average?.toFixed(1)}
//                 </span>
//               </div>

//               {/* Buttons */}
//               <div className="flex flex-wrap gap-3">
//                 <Link
//                   to={`/movie/${movie.id}/watch`}
//                   className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-lg transition-all hover:scale-105 shadow-lg shadow-amber-500/30"
//                 >
//                   <FaPlay className="text-xs" />
//                   Watch Now
//                 </Link>
//                 <Link
//                   to={`/movie/${movie.id}`}
//                   className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
//                 >
//                   <FaInfoCircle />
//                   More Info
//                 </Link>
//               </div>
//             </div>

//             {/* Navigation Dots + Arrows */}
//             <div className="absolute bottom-5 right-5 sm:bottom-6 sm:right-8 flex items-center gap-3 bg-black/60 backdrop-blur-md rounded-full px-2 py-1.5 border border-white/10">
//               <button
//                 onClick={prev}
//                 className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white transition-colors"
//                 aria-label="Previous"
//               >
//                 <FaChevronLeft className="text-xs" />
//               </button>

//               <div className="flex items-center gap-1.5">
//                 {Array.from({ length: total }).map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setIndex(i)}
//                     className={`rounded-full transition-all ${
//                       i === index
//                         ? 'w-5 h-1.5 bg-amber-500'
//                         : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
//                     }`}
//                     aria-label={`Go to slide ${i + 1}`}
//                   />
//                 ))}
//               </div>

//               <button
//                 onClick={next}
//                 className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white transition-colors"
//                 aria-label="Next"
//               >
//                 <FaChevronRight className="text-xs" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// /* ==================== Horizontal Row Carousel ==================== */
// const RowCarousel = ({
//   title,
//   movies,
// }: {
//   title: string
//   movies: Movie[]
// }) => {
//   const scrollRef = useRef<HTMLDivElement>(null)
//   const [canScrollLeft, setCanScrollLeft] = useState(false)
//   const [canScrollRight, setCanScrollRight] = useState(true)

//   const checkScroll = () => {
//     const el = scrollRef.current
//     if (!el) return
//     setCanScrollLeft(el.scrollLeft > 0)
//     setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
//   }

//   useEffect(() => {
//     const el = scrollRef.current
//     if (!el) return
//     checkScroll()
//     el.addEventListener('scroll', checkScroll, { passive: true })
//     window.addEventListener('resize', checkScroll)
//     return () => {
//       el.removeEventListener('scroll', checkScroll)
//       window.removeEventListener('resize', checkScroll)
//     }
//   }, [movies])

//   const scroll = (direction: 'left' | 'right') => {
//     const el = scrollRef.current
//     if (!el) return
//     const scrollAmount = el.clientWidth * 0.85
//     el.scrollBy({
//       left: direction === 'left' ? -scrollAmount : scrollAmount,
//       behavior: 'smooth',
//     })
//   }

//   if (!movies.length) return null

//   return (
//     <section className="mb-12 relative" aria-label={title}>
//       <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-5">
//         <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
//           <span className="w-1 h-7 bg-red-600 rounded-full" />
//           {title}
//         </h2>

//         <div className="hidden md:flex items-center gap-2">
//           <button
//             onClick={() => scroll('left')}
//             disabled={!canScrollLeft}
//             className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
//             aria-label="Scroll left"
//           >
//             <FaChevronLeft />
//           </button>
//           <button
//             onClick={() => scroll('right')}
//             disabled={!canScrollRight}
//             className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
//             aria-label="Scroll right"
//           >
//             <FaChevronRight />
//           </button>
//         </div>
//       </div>

//       <div className="relative">
//         {canScrollLeft && (
//           <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0f1014] to-transparent z-10 pointer-events-none" />
//         )}
//         {canScrollRight && (
//           <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0f1014] to-transparent z-10 pointer-events-none" />
//         )}

//         <div
//           ref={scrollRef}
//           className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4"
//           style={{ scrollSnapType: 'x mandatory' }}
//         >
//           {movies.map((movie) => (
//             <Link
//               key={movie.id}
//               to={`/movie/${movie.id}`}
//               className="flex-shrink-0 w-[150px] sm:w-[180px] md:w-[200px] group/card"
//               style={{ scrollSnapAlign: 'start' }}
//             >
//               <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-white/5 border border-white/10 group-hover/card:border-red-600/60 transition-all duration-300">
//                 <img
//                   src={getImageUrl(movie.poster_path, 'w500')}
//                   alt={movie.title}
//                   loading="lazy"
//                   className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
//                 />
//                 <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-yellow-400 text-xs px-2 py-1 rounded flex items-center gap-1">
//                   <FaStar className="text-[10px]" />
//                   {movie.vote_average?.toFixed(1)}
//                 </div>
//                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
//                   <div className="flex items-center gap-2 mb-2">
//                     <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white">
//                       <FaPlay className="text-xs ml-0.5" />
//                     </div>
//                     <span className="text-white text-xs font-medium">Watch Now</span>
//                   </div>
//                 </div>
//               </div>
//               <h3 className="mt-2 text-sm font-semibold text-white truncate group-hover/card:text-red-500 transition-colors">
//                 {movie.title}
//               </h3>
//               <p className="text-xs text-gray-500">
//                 {movie.release_date?.split('-')[0] || 'N/A'}
//               </p>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// /* ==================== Main Export ==================== */
// const HeroCarousel = ({
//   title,
//   movies,
//   loading = false,
//   variant = 'row',
// }: HeroCarouselProps) => {
//   if (loading) {
//     if (variant === 'featured') {
//       return (
//         <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-8">
//           <div className="h-[380px] sm:h-[440px] md:h-[520px] lg:h-[600px] rounded-2xl bg-white/5 animate-pulse" />
//         </div>
//       )
//     }
//     return (
//       <section className="mb-12">
//         <h2 className="text-2xl md:text-3xl font-bold text-white mb-5 px-4 sm:px-6 lg:px-8">
//           {title}
//         </h2>
//         <div className="flex gap-4 overflow-hidden px-4 sm:px-6 lg:px-8">
//           {[...Array(6)].map((_, i) => (
//             <div
//               key={i}
//               className="flex-shrink-0 w-[150px] sm:w-[180px] md:w-[200px] aspect-[2/3] rounded-xl bg-white/5 animate-pulse"
//             />
//           ))}
//         </div>
//       </section>
//     )
//   }

//   if (!movies || movies.length === 0) return null

//   if (variant === 'featured') {
//     return <FeaturedHero title={title} movies={movies} />
//   }

//   return <RowCarousel title={title} movies={movies} />
// }

// export default HeroCarousel

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaPlay,
  FaInfoCircle,
  FaCalendarAlt,
} from 'react-icons/fa'
import { getImageUrl } from '../services/tmdb'
import type { Movie } from '../types/tmdb'

interface HeroCarouselProps {
  title: string
  movies: Movie[]
  loading?: boolean
  variant?: 'featured' | 'row'
}

/* ==================== Featured Hero Banner (Big Auto-Change) ==================== */
const FeaturedHero = ({
  title,
  movies,
}: {
  title: string
  movies: Movie[]
}) => {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || movies.length === 0) return
    const t = setInterval(() => {
      setIndex((p) => (p + 1) % Math.min(movies.length, 10))
    }, 6000)
    return () => clearInterval(t)
  }, [paused, movies.length])

  if (!movies.length) return null

  const movie = movies[index]
  const total = Math.min(movies.length, 10)

  const next = () => setIndex((p) => (p + 1) % total)
  const prev = () => setIndex((p) => (p - 1 + total) % total)

  return (
    <section
      className="relative w-full pt-20 md:pt-24 pb-6 md:pb-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label={title}
    >
      {/* এখানে max-w-7xl এবং mx-auto যোগ করা হয়েছে — বড় মনিটরে ব্যানার কেন্দ্রে থাকবে */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-xl md:rounded-2xl overflow-hidden border border-red-900/40 shadow-2xl shadow-red-900/20">
          {/* Backdrop — বড় মনিটরে উচ্চতা বাড়ানো হয়েছে */}
          <div className="relative w-full h-[240px] sm:h-[320px] md:h-[420px] lg:h-[500px] xl:h-[580px]">
            <img
              key={movie.id}
              src={getImageUrl(movie.backdrop_path, 'original')}
              alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="eager"
              sizes="100vw"
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

            {/* Top Right Badges */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 z-10">
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded bg-red-600 text-white text-[9px] sm:text-xs font-bold uppercase tracking-wider">
                Featured
              </span>
              <span className="hidden sm:inline-block px-3 py-1 rounded bg-black/70 backdrop-blur-sm border border-white/20 text-white text-[10px] sm:text-xs font-semibold">
                Dual Audio
              </span>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-10 lg:p-12 z-10">
              <div className="max-w-2xl lg:max-w-3xl">
                {/* Title — বড় মনিটরে টাইটেল সাইজ কমানো হয়েছে যাতে বেশি জায়গা না নেয় */}
                <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight drop-shadow-2xl mb-2 md:mb-4 uppercase tracking-wide line-clamp-2">
                  {movie.title}
                </h1>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 md:mb-5">
                  <span className="px-2 py-0.5 rounded border border-white/40 text-white text-[10px] sm:text-xs font-bold">
                    HD
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-300 text-xs sm:text-sm">
                    <FaCalendarAlt className="text-[10px] sm:text-xs" />
                    {movie.release_date
                      ? new Date(movie.release_date).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Coming Soon'}
                  </span>
                  <span className="flex items-center gap-1.5 text-yellow-400 text-xs sm:text-sm font-bold">
                    <FaStar className="text-[10px] sm:text-xs" />
                    {movie.vote_average?.toFixed(1)}
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Link
                    to={`/movie/${movie.id}/watch`}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-lg transition-all hover:scale-105 shadow-lg shadow-amber-500/30 text-sm sm:text-base"
                  >
                    <FaPlay className="text-[10px] sm:text-xs" />
                    Watch Now
                  </Link>
                  <Link
                    to={`/movie/${movie.id}`}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all text-sm sm:text-base"
                  >
                    <FaInfoCircle className="text-xs sm:text-sm" />
                    More Info
                  </Link>
                </div>
              </div>

              {/* Navigation Dots + Arrows — মোবাইলে নিচে, ডেস্কটপে ডানে */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-6 md:bottom-5 md:right-8 flex items-center gap-2 sm:gap-3 bg-black/60 backdrop-blur-md rounded-full px-2 py-1 sm:px-2 sm:py-1.5 border border-white/10">
                <button
                  onClick={prev}
                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  aria-label="Previous"
                >
                  <FaChevronLeft className="text-[10px] sm:text-xs" />
                </button>

                <div className="hidden sm:flex items-center gap-1.5">
                  {Array.from({ length: total }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`rounded-full transition-all ${
                        i === index
                          ? 'w-5 h-1.5 bg-amber-500'
                          : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Mobile dots — শুধু সংখ্যা */}
                <span className="sm:hidden text-white text-xs font-medium px-1">
                  {index + 1} / {total}
                </span>

                <button
                  onClick={next}
                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  aria-label="Next"
                >
                  <FaChevronRight className="text-[10px] sm:text-xs" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==================== Horizontal Row Carousel ==================== */
const RowCarousel = ({
  title,
  movies,
}: {
  title: string
  movies: Movie[]
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [movies])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = el.clientWidth * 0.85
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (!movies.length) return null

  return (
    <section className="mb-8 md:mb-12 relative" aria-label={title}>
      {/* এখানেও max-w-7xl এবং mx-auto — বড় মনিটরে মার্জিন ঠিক থাকবে */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-4 md:mb-5">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <span className="w-1 h-6 sm:h-7 bg-red-600 rounded-full" />
            {title}
          </h2>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-sm" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll right"
            >
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        </div>

        <div className="relative">
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-16 bg-gradient-to-r from-[#0f1014] to-transparent z-10 pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-16 bg-gradient-to-l from-[#0f1014] to-transparent z-10 pointer-events-none" />
          )}

          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {movies.map((movie) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="flex-shrink-0 w-[130px] sm:w-[150px] md:w-[180px] lg:w-[200px] group/card"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="relative aspect-[2/3] rounded-lg md:rounded-xl overflow-hidden bg-white/5 border border-white/10 group-hover/card:border-red-600/60 transition-all duration-300">
                  <img
                    src={getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover/card:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-yellow-400 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex items-center gap-1">
                    <FaStar className="text-[8px] sm:text-[10px]" />
                    {movie.vote_average?.toFixed(1)}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 sm:p-3">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-600 flex items-center justify-center text-white">
                        <FaPlay className="text-[10px] sm:text-xs ml-0.5" />
                      </div>
                      <span className="text-white text-[10px] sm:text-xs font-medium">
                        Watch Now
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-semibold text-white truncate group-hover/card:text-red-500 transition-colors">
                  {movie.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  {movie.release_date?.split('-')[0] || 'N/A'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==================== Main Export ==================== */
const HeroCarousel = ({
  title,
  movies,
  loading = false,
  variant = 'row',
}: HeroCarouselProps) => {
  if (loading) {
    if (variant === 'featured') {
      return (
        <div className="w-full pt-20 md:pt-24 pb-6 md:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-[240px] sm:h-[320px] md:h-[420px] lg:h-[500px] xl:h-[580px] rounded-xl md:rounded-2xl bg-white/5 animate-pulse" />
          </div>
        </div>
      )
    }
    return (
      <section className="mb-8 md:mb-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 md:mb-5 px-4 sm:px-6 lg:px-8">
            {title}
          </h2>
          <div className="flex gap-3 sm:gap-4 overflow-hidden px-4 sm:px-6 lg:px-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[130px] sm:w-[150px] md:w-[180px] lg:w-[200px] aspect-[2/3] rounded-lg md:rounded-xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!movies || movies.length === 0) return null

  if (variant === 'featured') {
    return <FeaturedHero title={title} movies={movies} />
  }

  return <RowCarousel title={title} movies={movies} />
}

export default HeroCarousel