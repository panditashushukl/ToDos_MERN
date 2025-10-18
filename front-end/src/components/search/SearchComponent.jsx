import { useTodo } from "./../../contexts/TodoContext";
import { FaSearch } from "react-icons/fa";
import { InputField } from "./../index";

const SearchComponent = ({className ,...props}) => {
  const { searchTerm, handleSearchChange } = useTodo();

  return (
    <div className={`mb-6 ${className}`}>
      <InputField
        name="search"
        type="text"
        label="Search todos"
        placeholder="Search Todos..."
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        Icon={FaSearch}
        {...props}
      />
    </div>
  );
};

export default SearchComponent;
