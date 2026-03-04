import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await tmdb.get("/movie/popular", {
      params: {
        api_key: API_KEY,
        page,
      },
    });

    return response.data;   
  } catch (error) {
    console.error("Error fetching movies:", error);
    return null;
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdb.get("/search/movie", {
      params: {
        api_key: API_KEY,
        query: query,
        page: page,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};