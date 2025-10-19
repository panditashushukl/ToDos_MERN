import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="text-center max-w-md">
        {/* Animated Emoji */}
        <div className="text-7xl animate-bounce mb-6">😵‍💫</div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold mb-4">404 : NOT FOUND</h1>
        <p className="text-xl text-gray-400 mb-6">
          Oops 😣, This page vanished into the void.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-block px-6 py-3 text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-lg transition duration-200"
        >
          🏠 Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
