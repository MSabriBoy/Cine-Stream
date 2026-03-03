import { useEffect, useState, useRef } from "react";
import { fetchPopularMovies, searchMovies } from "./services/tmdb";
import MovieCard from "./components/MovieCard";
import useDebounce from "./hooks/useDebounce";

function Home() {
  const observerRef = useRef(null);

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setPage(1);
    setMovies([]);
  }, [debouncedSearch]);

  useEffect(() => {
    const loadMovies = async () => {
  if (page === 1) {
      setInitialLoading(true);
    } else {
      setLoadingMore(true);
    }

      let data;

      if (debouncedSearch.trim() === "") {
        data = await fetchPopularMovies(page);
      } else {
        data = await searchMovies(debouncedSearch, page);
      }

      setMovies((prev) =>
        page === 1 ? data : [...prev, ...data]
      );
       setInitialLoading(false);
    setLoadingMore(false);
    };

    loadMovies();
  }, [debouncedSearch, page]);

  useEffect(() => {
    const target = document.querySelector("#scroll-trigger");
    if (!target) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && !initialLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(target);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadingMore, initialLoading]);

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🎬 CineStream
      </h1>

      <div className="flex justify-center mb-8">
        <input
          type="search"
          placeholder="Search movies..."
          className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
  {/* Initial Big Loader */}
  {initialLoading && page === 1 && (
    <p className="text-center mt-10 text-gray-400">
      Loading movies...
    </p>
  )}
      {/* Grid ALWAYS stays */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Bottom Loading Indicator */}
      {loadingMore && (
    <p className="text-center mt-6 text-gray-400">
      Loading more movies...
    </p>
  )}

      <div id="scroll-trigger" className="h-10"></div>
    </div>
  );
}

export default Home;