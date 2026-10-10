// import { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { DetailsLayout } from '../components/DetailsLayout'
// import { CastList } from '../components/CastList'
// import { Carousel } from '../components/Carousel'
// import { CollectionSection } from '../components/CollectionSection'
// import { CompanyCard } from '../components/CompanyCard'
// import { MediaGallery } from '../components/MediaGallery'
// import { ReviewsSection } from '../components/ReviewsSection'
// import { Modal } from '../components/Modal'
// import {
//   fetchMovieDetails,
//   fetchMovieVideos,
//   fetchMovieCredits,
//   fetchSimilarMovies,
//   fetchCollection,
//   fetchMovieImages,
//   fetchExternalIds,
//   fetchReviews,
//   fetchKeywords,
//   fetchMovieContentRatings
// } from '../services/tmdb'
// import { isInWatchlist, toggleWatchlist } from '../utils/watchlist'
// import type { MovieDetails, Video, Credits, Movie, CollectionDetails, Keyword } from '../types/tmdb'
// import { FaImdb, FaInstagram, FaTwitter, FaFacebook, FaLink } from 'react-icons/fa'

// const MovieDetailPage = () => {
//   const { id } = useParams<{ id: string }>()
//   const navigate = useNavigate()

//   // State
//   const [movie, setMovie] = useState<MovieDetails | null>(null)
//   const [trailer, setTrailer] = useState<Video | null>(null)
//   const [credits, setCredits] = useState<Credits | null>(null)
//   const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
//   const [collection, setCollection] = useState<CollectionDetails | null>(null)
//   const [images, setImages] = useState<{ backdrops: any[], posters: any[], logos: any[] } | null>(null)
//   const [externalIds, setExternalIds] = useState<any>(null)
//   const [reviews, setReviews] = useState<any[]>([])
//   const [keywords, setKeywords] = useState<Keyword[]>([])
//   const [rating, setRating] = useState<string | null>(null)

//   const [loading, setLoading] = useState(true)
//   const [showTrailer, setShowTrailer] = useState(false)
//   const [inWatchlist, setInWatchlist] = useState(false)

//   useEffect(() => {
//     const loadMovieDetails = async () => {
//       if (!id) return

//       setLoading(true)
//       try {
//         const movieId = Number(id)
//         const [
//           movieData,
//           videos,
//           creditsData,
//           similar,
//           imagesData,
//           idsData,
//           reviewsData,
//           keywordsData,
//           ratingsData
//         ] = await Promise.all([
//           fetchMovieDetails(movieId),
//           fetchMovieVideos(movieId),
//           fetchMovieCredits(movieId),
//           fetchSimilarMovies(movieId),
//           fetchMovieImages(movieId),
//           fetchExternalIds(movieId, 'movie'),
//           fetchReviews(movieId, 'movie'),
//           fetchKeywords(movieId, 'movie'),
//           fetchMovieContentRatings(movieId)
//         ])

//         setMovie(movieData)
//         setSimilarMovies(similar)
//         setCredits(creditsData)
//         setImages(imagesData)
//         setExternalIds(idsData)
//         setReviews(reviewsData)
//         setKeywords(keywordsData)
//         setInWatchlist(isInWatchlist(movieId, 'movie'))

//         // Find trailer
//         const youtubeTrailer = videos.find(
//           (v) => v.type === 'Trailer' && v.site === 'YouTube'
//         )
//         setTrailer(youtubeTrailer || videos[0] || null)

//         // Set Rating
//         const usRating = ratingsData.results.find(r => r.iso_3166_1 === 'US')
//         if (usRating && usRating.release_dates.length > 0) {
//           setRating(usRating.release_dates[0].certification)
//         }

//         // Fetch collection
//         if (movieData.belongs_to_collection) {
//           try {
//             const collectionData = await fetchCollection(movieData.belongs_to_collection.id)
//             setCollection(collectionData)
//           } catch (error) {
//             console.error('Failed to load collection:', error)
//           }
//         }
//       } catch (error) {
//         console.error('Failed to load movie details:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadMovieDetails()

//     const handleWatchlistUpdate = () => {
//       if (id) setInWatchlist(isInWatchlist(Number(id), 'movie'))
//     }

//     window.addEventListener('watchlist-updated', handleWatchlistUpdate)
//     return () => window.removeEventListener('watchlist-updated', handleWatchlistUpdate)
//   }, [id])

//   return (
//     <DetailsLayout
//       item={movie}
//       type="movie"
//       trailer={trailer}
//       loading={loading}
//       onPlay={() => navigate(`/movie/${id}/watch`)}
//       onTrailer={() => setShowTrailer(true)}
//       inWatchlist={inWatchlist}
//       onToggleWatchlist={() => movie && toggleWatchlist(movie, 'movie')}
//       rating={rating}
//     >
//       {/* Overview Section */}
//       <section id="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-12">
//         <div className="lg:col-span-2 space-y-8">
//           <div>
//             <h2 className="text-2xl font-bold text-white mb-4">Storyline</h2>
//             <p className="text-gray-300 text-lg leading-relaxed">{movie?.overview}</p>
//           </div>

//           {/* Keywords */}
//           {keywords.length > 0 && (
//             <div className="flex flex-wrap gap-2">
//               {keywords.map(keyword => (
//                 <span key={keyword.id} className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-400 border border-white/5">
//                   #{keyword.name}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Sidebar Info */}
//         <div className="space-y-8">
//           <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-6">
//             <div>
//               <h3 className="text-gray-400 text-sm font-medium mb-1">Status</h3>
//               <p className="text-white font-semibold">{movie?.status}</p>
//             </div>
//             <div>
//               <h3 className="text-gray-400 text-sm font-medium mb-1">Original Language</h3>
//               <p className="text-white font-semibold uppercase">{movie?.original_language}</p>
//             </div>
//             <div>
//               <h3 className="text-gray-400 text-sm font-medium mb-1">Budget</h3>
//               <p className="text-white font-semibold">
//                 {movie?.budget ? `$${(movie.budget / 1000000).toFixed(1)}M` : 'N/A'}
//               </p>
//             </div>
//             <div>
//               <h3 className="text-gray-400 text-sm font-medium mb-1">Revenue</h3>
//               <p className="text-white font-semibold">
//                 {movie?.revenue ? `$${(movie.revenue / 1000000).toFixed(1)}M` : 'N/A'}
//               </p>
//             </div>
//           </div>

//           {/* Social Links */}
//           {externalIds && (
//             <div className="flex gap-4">
//               {externalIds.imdb_id && (
//                 <a href={`https://www.imdb.com/title/${externalIds.imdb_id}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full text-yellow-500 hover:bg-white/10 transition-colors">
//                   <FaImdb className="text-2xl" />
//                 </a>
//               )}
//               {externalIds.facebook_id && (
//                 <a href={`https://facebook.com/${externalIds.facebook_id}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full text-blue-500 hover:bg-white/10 transition-colors">
//                   <FaFacebook className="text-xl" />
//                 </a>
//               )}
//               {externalIds.instagram_id && (
//                 <a href={`https://instagram.com/${externalIds.instagram_id}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full text-pink-500 hover:bg-white/10 transition-colors">
//                   <FaInstagram className="text-xl" />
//                 </a>
//               )}
//               {externalIds.twitter_id && (
//                 <a href={`https://twitter.com/${externalIds.twitter_id}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full text-blue-400 hover:bg-white/10 transition-colors">
//                   <FaTwitter className="text-xl" />
//                 </a>
//               )}
//               {movie?.homepage && (
//                 <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full text-gray-400 hover:bg-white/10 transition-colors">
//                   <FaLink className="text-xl" />
//                 </a>
//               )}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Cast Section */}
//       <section id="cast">
//         {credits && credits.cast.length > 0 && (
//           <CastList cast={credits.cast} showButton />
//         )}
//       </section>

//       {/* Media Section */}
//       {images && (
//         <MediaGallery
//           posters={images.posters}
//           backdrops={images.backdrops}
//           videos={trailer ? [trailer] : []}
//           title={movie?.title || ''}
//         />
//       )}

//       {/* Reviews Section */}
//       {reviews.length > 0 && (
//         <ReviewsSection reviews={reviews} />
//       )}

//       {/* Collection Section */}
//       {collection && collection.parts.length > 1 && (
//         <CollectionSection collection={collection} />
//       )}

//       {/* Production Companies */}
//       {movie?.production_companies && movie.production_companies.length > 0 && (
//         <section>
//           <h2 className="text-2xl font-bold text-white mb-6">Production Companies</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//             {movie.production_companies.slice(0, 5).map((company) => (
//               <CompanyCard key={company.id} company={company} />
//             ))}
//           </div>
//         </section>
//       )}

//       {/* Related Section */}
//       <section id="related">
//         {similarMovies.length > 0 && (
//           <Carousel title="More Like This" items={similarMovies} mediaType="movie" />
//         )}
//       </section>

//       {/* Trailer Modal */}
//       {trailer && (
//         <Modal
//           isOpen={showTrailer}
//           onClose={() => setShowTrailer(false)}
//           title={`${movie?.title} - Trailer`}
//         >
//           <div className="p-4">
//             <div className="aspect-video">
//               <iframe
//                 src={`https://www.youtube.com/embed/${trailer.key}`}
//                 title={trailer.name}
//                 className="w-full h-full"
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//               />
//             </div>
//           </div>
//         </Modal>
//       )}
//     </DetailsLayout>
//   )
// }

// export default MovieDetailPage
import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { DetailsLayout } from '../components/DetailsLayout'
import { CastList } from '../components/CastList'
import { Carousel } from '../components/Carousel'
import { CollectionSection } from '../components/CollectionSection'
import { CompanyCard } from '../components/CompanyCard'
import { MediaGallery } from '../components/MediaGallery'
import { Modal } from '../components/Modal'
import { SEO } from '../components/SEO'
import {
  fetchMovieDetails,
  fetchMovieVideos,
  fetchMovieCredits,
  fetchSimilarMovies,
  fetchCollection,
  fetchMovieImages,
  fetchExternalIds,
  fetchKeywords,
  fetchMovieContentRatings,
  getAudioLanguages,
  isDualAudio,
} from '../services/tmdb'
import type { MovieDetails, Video, Credits, Movie, CollectionDetails, Keyword } from '../types/tmdb'
import { FaImdb, FaPlay } from 'react-icons/fa'

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // State
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [trailer, setTrailer] = useState<Video | null>(null)
  const [credits, setCredits] = useState<Credits | null>(null)
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [collection, setCollection] = useState<CollectionDetails | null>(null)
  const [images, setImages] = useState<{ backdrops: any[], posters: any[], logos: any[] } | null>(null)
  const [externalIds, setExternalIds] = useState<any>(null)
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [rating, setRating] = useState<string | null>(null)
  const [director, setDirector] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    const loadMovieDetails = async () => {
      if (!id) return

      setLoading(true)
      try {
        const movieId = Number(id)
        const [
          movieData,
          videos,
          creditsData,
          similar,
          imagesData,
          idsData,
          keywordsData,
          ratingsData
        ] = await Promise.all([
          fetchMovieDetails(movieId),
          fetchMovieVideos(movieId),
          fetchMovieCredits(movieId),
          fetchSimilarMovies(movieId),
          fetchMovieImages(movieId),
          fetchExternalIds(movieId, 'movie'),
          fetchKeywords(movieId, 'movie'),
          fetchMovieContentRatings(movieId)
        ])

        setMovie(movieData)
        setSimilarMovies(similar)
        setCredits(creditsData)
        setImages(imagesData)
        setExternalIds(idsData)
        setKeywords(keywordsData)

        const directorData = creditsData.crew.find(
          (person) => person.job === 'Director'
        )
        setDirector(directorData?.name || null)

        const youtubeTrailer = videos.find(
          (v) => v.type === 'Trailer' && v.site === 'YouTube'
        )
        setTrailer(youtubeTrailer || videos[0] || null)

        const usRating = ratingsData.results.find(r => r.iso_3166_1 === 'US')
        if (usRating && usRating.release_dates.length > 0) {
          setRating(usRating.release_dates[0].certification)
        }

        if (movieData.belongs_to_collection) {
          try {
            const collectionData = await fetchCollection(movieData.belongs_to_collection.id)
            setCollection(collectionData)
          } catch (error) {
            console.error('Failed to load collection:', error)
          }
        }
      } catch (error) {
        console.error('Failed to load movie details:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMovieDetails()
  }, [id])

  return (
    <>
      {movie && (
        <SEO
          title={`${movie.title} (${new Date(movie.release_date).getFullYear()}) - Watch Online`}
          description={movie.overview?.slice(0, 160) || `Watch ${movie.title} online in HD.`}
          image={movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : undefined}
          type="website"
          url={`/movie/${id}`}
        />
      )}

      <DetailsLayout
        item={movie}
        type="movie"
        trailer={trailer}
        loading={loading}
        onPlay={() => navigate(`/movie/${id}/watch`)}
        onTrailer={() => setShowTrailer(true)}
        inWatchlist={false}
        onToggleWatchlist={() => {}}
        rating={rating}
      >
        {/* Overview Section */}
        <section id="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Storyline</h2>
              <p className="text-gray-300 text-lg leading-relaxed">{movie?.overview}</p>
            </div>

            {director && (
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm font-medium">Director:</span>
                <span className="text-white font-semibold">{director}</span>
              </div>
            )}

            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keywords.map(keyword => (
                  <span key={keyword.id} className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-400 border border-white/5">
                    #{keyword.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-6">
              <div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">Status</h3>
                <p className="text-white font-semibold">{movie?.status}</p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">Original Language</h3>
                <p className="text-white font-semibold uppercase">{movie?.original_language}</p>
              </div>
              {movie && (
                <div>
                  <h3 className="text-gray-400 text-sm font-medium mb-1">Audio Languages</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-white font-semibold">
                      {getAudioLanguages(movie).join(', ') || 'N/A'}
                    </p>
                    {isDualAudio(movie) && (
                      <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-300">
                        Dual Audio
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">Budget</h3>
                <p className="text-white font-semibold">
                  {movie?.budget ? `$${(movie.budget / 1000000).toFixed(1)}M` : 'N/A'}
                </p>
              </div>
              <div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">Revenue</h3>
                <p className="text-white font-semibold">
                  {movie?.revenue ? `$${(movie.revenue / 1000000).toFixed(1)}M` : 'N/A'}
                </p>
              </div>

              {externalIds?.imdb_id && (
                <div className="pt-4 border-t border-white/10">
                  <a
                    href={`https://www.imdb.com/title/${externalIds.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-500 transition-colors"
                    aria-label="IMDb"
                  >
                    <FaImdb className="text-2xl" />
                    <span className="text-sm font-semibold">View on IMDb</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Watch Online CTA Section */}
        <section className="mt-12">
          <div className="bg-gradient-to-br from-red-950/40 via-black to-black rounded-2xl p-6 md:p-10 border border-red-900/40 shadow-2xl shadow-red-900/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-red-700 rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Watch Online
              </h2>
            </div>

            <div>
              <Link
                to={`/movie/${id}/watch`}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-red-600/40 hover:shadow-red-600/60 hover:-translate-y-0.5 text-lg"
              >
                <FaPlay className="text-sm" />
                Watch Online Free
              </Link>
            </div>
          </div>
        </section>

        {/* Screenshots Section */}
        {images && images.backdrops.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-7 bg-red-600 rounded-full" />
              <h2 className="text-2xl font-bold text-white">Screenshots</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.backdrops.slice(0, 6).map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-white/10 group">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                    alt={`${movie?.title} screenshot ${i + 1}`}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="cast">
          {credits && credits.cast.length > 0 && (
            <CastList cast={credits.cast} showButton />
          )}
        </section>

        {images && (
          <MediaGallery
            posters={images.posters}
            backdrops={images.backdrops}
            videos={trailer ? [trailer] : []}
            title={movie?.title || ''}
          />
        )}

        {collection && collection.parts.length > 1 && (
          <CollectionSection collection={collection} />
        )}

        {movie?.production_companies && movie.production_companies.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-7 bg-red-600 rounded-full" />
              <h2 className="text-2xl font-bold text-white">Production Companies</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movie.production_companies.slice(0, 5).map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          </section>
        )}

        <section id="related">
          {similarMovies.length > 0 && (
            <Carousel title="More Like This" items={similarMovies} mediaType="movie" />
          )}
        </section>

        {trailer && (
          <Modal
            isOpen={showTrailer}
            onClose={() => setShowTrailer(false)}
            title={`${movie?.title} - Trailer`}
          >
            <div className="p-4">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={trailer.name}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </Modal>
        )}
      </DetailsLayout>
    </>
  )
}

export default MovieDetailPage