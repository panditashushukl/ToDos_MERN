import { useTodo } from "./../../contexts/TodoContext";
import { FaSearch } from "react-icons/fa";

const SearchComponent = () => {
  const { searchTerm, handleSearchChange } = useTodo();

  return (
    <div className="mb-6">
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search todos..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none "
        />
      </div>
    </div>
  );
};

export default SearchComponent;
