import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import { useEffect, useState, useRef } from "react";
import { fetchPopularMovies, searchMovies } from "./services/tmdb";
import MovieCard from "./components/MovieCard";
import useDebounce from "./hooks/useDebounce";

function App() {
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


   <div className="bg-black min-h-screen text-white">
      <nav className="flex justify-between items-center p-6 border-b border-gray-800">
        <Link to="/" className="text-2xl font-bold">
          🎬 CineStream
        </Link>

        <Link
          to="/favorites"
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
        >
          ❤️ My Favorites
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </div>
  );
}

export default App;