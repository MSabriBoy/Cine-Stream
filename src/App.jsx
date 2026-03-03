import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";

function App() {
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