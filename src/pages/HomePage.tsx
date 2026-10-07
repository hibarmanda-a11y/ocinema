import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "../components/SEO";
import Hero from "../components/Hero";
import { Carousel } from "../components/Carousel";
import { AnimatedSection } from "../components/AnimatedSection";
import { BentoGrid } from "../components/BentoGrid";

import { StudioShowcase } from "../components/StudioShowcase";
import { GenreExplorer } from "../components/GenreExplorer";
import { InstallPWAPrompt } from "../components/InstallPWAPrompt";
import { KeepWatching } from "../components/KeepWatching";

import { SkeletonHero } from "../components/SkeletonHero";
import { SkeletonCard } from "../components/SkeletonCard";
import { RandomButton } from "../components/RandomButton";

import { FeaturedCollection } from "../components/FeaturedCollection";

import { getHomeMode } from "../utils/homeMode";
import { LatestReleasesGrid } from "../components/LatestReleasesGrid";
import {
  fetchTrendingMoviesPaginated,
  fetchPopularMoviesPaginated,
  fetchTopRatedMoviesPaginated,
  fetchNowPlayingMoviesPaginated,
  fetchPopularTVShowsPaginated,
  fetchTopRatedTVShowsPaginated,
  fetchTrendingTVShowsPaginated,
} from "../services/tmdbPaginated";
import {
  fetchLatestHindiMovies,
  fetchLatestOtherMovies,
} from "../services/tmdb";
import type { Movie, TVShow } from "../types/tmdb";

const HomePage = () => {
  const navigate = useNavigate();

  const [hindiMovies, setHindiMovies] = useState<Movie[]>([]);
  const [otherMovies, setOtherMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<TVShow[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TVShow[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<TVShow[]>([]);
  const [heroLoading, setHeroLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(true);

  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        const [hindi, other] = await Promise.all([
          fetchLatestHindiMovies(1),
          fetchLatestOtherMovies(1),
        ]);

        setHindiMovies(hindi);
        setOtherMovies(other);
        setHeroLoading(false);
      } catch (error) {
        console.error("Failed to load hero content:", error);
        setHeroLoading(false);
      }
    };

    const loadRestOfContent = async () => {
      try {
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          ) || window.innerWidth < 768;
        const pagesToLoad = isMobile ? 2 : 3;
        const promises = [];

        for (let i = 1; i <= pagesToLoad; i++)
          promises.push(fetchTrendingMoviesPaginated(i));
        for (let i = 1; i <= pagesToLoad; i++)
          promises.push(fetchPopularMoviesPaginated(i));
        for (let i = 1; i <= pagesToLoad; i++)
          promises.push(fetchTopRatedMoviesPaginated(i));
        for (let i = 1; i <= pagesToLoad; i++)
          promises.push(fetchNowPlayingMoviesPaginated(i));
        for (let i = 1; i <= pagesToLoad; i++)
          promises.push(fetchTrendingTVShowsPaginated(i));
        for (let i = 1; i <= pagesToLoad; i++)
          promises.push(fetchPopularTVShowsPaginated(i));
        for (let i = 1; i <= pagesToLoad; i++)
          promises.push(fetchTopRatedTVShowsPaginated(i));

        const results = await Promise.all(promises);

        const emptyMovieResponse = { results: [] as Movie[] };
        const emptyTVResponse = { results: [] as TVShow[] };

        const trending1 = results[0] as typeof emptyMovieResponse;
        const trending2 = results[1] as typeof emptyMovieResponse;
        const trending3 =
          pagesToLoad === 3
            ? (results[2] as typeof emptyMovieResponse)
            : emptyMovieResponse;

        const popular1 = results[pagesToLoad] as typeof emptyMovieResponse;
        const popular2 = results[pagesToLoad + 1] as typeof emptyMovieResponse;
        const popular3 =
          pagesToLoad === 3
            ? (results[pagesToLoad + 2] as typeof emptyMovieResponse)
            : emptyMovieResponse;

        const topRated1 = results[pagesToLoad * 2] as typeof emptyMovieResponse;
        const topRated2 = results[
          pagesToLoad * 2 + 1
        ] as typeof emptyMovieResponse;
        const topRated3 =
          pagesToLoad === 3
            ? (results[pagesToLoad * 2 + 2] as typeof emptyMovieResponse)
            : emptyMovieResponse;

        const nowPlaying1 = results[
          pagesToLoad * 3
        ] as typeof emptyMovieResponse;
        const nowPlaying2 = results[
          pagesToLoad * 3 + 1
        ] as typeof emptyMovieResponse;
        const nowPlaying3 =
          pagesToLoad === 3
            ? (results[pagesToLoad * 3 + 2] as typeof emptyMovieResponse)
            : emptyMovieResponse;

        const trendingTV1 = results[pagesToLoad * 4] as typeof emptyTVResponse;
        const trendingTV2 = results[
          pagesToLoad * 4 + 1
        ] as typeof emptyTVResponse;
        const trendingTV3 =
          pagesToLoad === 3
            ? (results[pagesToLoad * 4 + 2] as typeof emptyTVResponse)
            : emptyTVResponse;

        const popularTV1 = results[pagesToLoad * 5] as typeof emptyTVResponse;
        const popularTV2 = results[
          pagesToLoad * 5 + 1
        ] as typeof emptyTVResponse;
        const popularTV3 =
          pagesToLoad === 3
            ? (results[pagesToLoad * 5 + 2] as typeof emptyTVResponse)
            : emptyTVResponse;

        const topRatedTV1 = results[pagesToLoad * 6] as typeof emptyTVResponse;
        const topRatedTV2 = results[
          pagesToLoad * 6 + 1
        ] as typeof emptyTVResponse;
        const topRatedTV3 =
          pagesToLoad === 3
            ? (results[pagesToLoad * 6 + 2] as typeof emptyTVResponse)
            : emptyTVResponse;

        const allTrending: Movie[] = [
          ...trending1.results,
          ...trending2.results,
          ...trending3.results,
        ];
        const allPopular: Movie[] = [
          ...popular1.results,
          ...popular2.results,
          ...popular3.results,
        ];
        const allTopRated: Movie[] = [
          ...topRated1.results,
          ...topRated2.results,
          ...topRated3.results,
        ];
        const allNowPlaying: Movie[] = [
          ...nowPlaying1.results,
          ...nowPlaying2.results,
          ...nowPlaying3.results,
        ];
        const allTrendingTV: TVShow[] = [
          ...trendingTV1.results,
          ...trendingTV2.results,
          ...trendingTV3.results,
        ];
        const allPopularTV: TVShow[] = [
          ...popularTV1.results,
          ...popularTV2.results,
          ...popularTV3.results,
        ];
        const allTopRatedTV: TVShow[] = [
          ...topRatedTV1.results,
          ...topRatedTV2.results,
          ...topRatedTV3.results,
        ];

        setTrendingMovies(allTrending);
        setPopularMovies(allPopular);
        setTopRatedMovies(allTopRated);
        setNowPlayingMovies(allNowPlaying);
        setTrendingTVShows(allTrendingTV);
        setPopularTVShows(allPopularTV);
        setTopRatedTVShows(allTopRatedTV);
      } catch (error) {
        console.error("Failed to load content:", error);
      } finally {
        setContentLoading(false);
      }
    };

    loadHeroContent();
    loadRestOfContent();
  }, []);

  useEffect(() => {
    const mode = getHomeMode();
    if (mode === "sports") {
      navigate("/sports", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  if (heroLoading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <SkeletonHero />
        <div className="max-w-7xl mx-auto py-6 md:py-12 space-y-6 md:space-y-12 px-4 sm:px-6 lg:px-8">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-4">
              <div className="h-6 md:h-8 bg-gray-800/50 rounded w-48 shimmer" />
              <div className="flex space-x-3 md:space-x-4 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-32 sm:w-40 md:w-48">
                    <SkeletonCard />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1014] pb-20 md:pb-0 overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-900/20 rounded-full blur-[150px] opacity-40" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-red-900/15 rounded-full blur-[150px] opacity-30" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[40%] bg-red-900/10 rounded-full blur-[150px] opacity-30" />
      </div>

      <div className="relative z-10">
        <SEO
          title="Home - Ocinema"
          description="Your ultimate destination for streaming movies and TV shows. Watch trending movies, popular series, and discover new content on Ocinema."
        />
        <InstallPWAPrompt />

        {/* Hero + Latest Carousels */}
        <Hero
          hindiMovies={hindiMovies}
          otherMovies={otherMovies}
          carouselLoading={contentLoading}
        />

        <RandomButton variant="floating" />
        <KeepWatching />
       

        {/* Latest Releases Grid + Pagination */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <LatestReleasesGrid title="Latest Releases" />
        </div>

        <div className="max-w-7xl mx-auto py-6 md:py-12 space-y-8 md:space-y-16 px-4 sm:px-6 lg:px-8"></div>
        <div className="max-w-7xl mx-auto py-6 md:py-12 space-y-8 md:space-y-16 px-4 sm:px-6 lg:px-8">
          {contentLoading ? (
            <div className="px-4 sm:px-6 lg:px-8 space-y-12">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="space-y-4">
                  <div className="h-6 md:h-8 bg-gray-800/50 rounded w-48 shimmer" />
                  <div className="flex space-x-3 md:space-x-4 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 w-32 sm:w-40 md:w-48"
                      >
                        <SkeletonCard />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <AnimatedSection>
                <BentoGrid
                  title="Trending Now"
                  items={trendingMovies}
                  type="movie"
                />
              </AnimatedSection>

              {/* <AnimatedSection delay={0.1}>
                <StreamingSpotlight />
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <TrendingPeople />
              </AnimatedSection> */}

              <AnimatedSection delay={0.1}>
                <Carousel
                  title="Popular Movies"
                  items={popularMovies}
                  mediaType="movie"
                  categoryPath="/category/popular-movies"
                />
              </AnimatedSection>

             

              <AnimatedSection delay={0.1}>
                <StudioShowcase />
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <Carousel
                  title="Trending TV Shows"
                  items={trendingTVShows}
                  mediaType="tv"
                  categoryPath="/category/trending-tv"
                />
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <GenreExplorer />
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <Carousel
                  title="Now Playing"
                  items={nowPlayingMovies}
                  mediaType="movie"
                  categoryPath="/category/now-playing"
                />
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <FeaturedCollection />
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <Carousel
                  title="Popular TV Shows"
                  items={popularTVShows}
                  mediaType="tv"
                  categoryPath="/category/popular-tv"
                />
              </AnimatedSection>

             

              <AnimatedSection delay={0.1}>
                <Carousel
                  title="Top Rated Movies"
                  items={topRatedMovies}
                  mediaType="movie"
                  categoryPath="/category/top-rated-movies"
                />
              </AnimatedSection>

            

              <AnimatedSection delay={0.1}>
                <Carousel
                  title="Top Rated TV Shows"
                  items={topRatedTVShows}
                  mediaType="tv"
                  categoryPath="/category/top-rated-tv"
                />
              </AnimatedSection>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
