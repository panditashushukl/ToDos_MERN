import { useState } from "react";
import { useTodo } from "./../../contexts/TodoContext";

const LabelCard = () => {
  const { labels, handleLabelFilterChange } = useTodo();
  const [currentPage, setCurrentPage] = useState(0);

  const pageSize = 4;
  const totalPages = Math.ceil((labels?.length || 0) / pageSize);

  if (!labels || labels.length === 0) return null;

  const startIndex = currentPage * pageSize;
  const visibleLabels = labels.slice(startIndex, startIndex + pageSize);

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-2">Labels</h3>
      <div className="space-y-1">
        {visibleLabels.map((label) => (
          <div
            key={label}
            className="text-sm text-gray-400 hover:text-white cursor-pointer py-1 px-2 rounded hover:bg-gray-800"
            onClick={() => handleLabelFilterChange(label)}
          >
            #{label}
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`hover:text-white ${currentPage === 0 ? "opacity-30 cursor-not-allowed" : "hover:underline"}`}
          >
            ◀ Prev
          </button>
          <span className="text-gray-400">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1}
            className={`hover:text-white ${currentPage >= totalPages - 1 ? "opacity-30 cursor-not-allowed" : "hover:underline"}`}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default LabelCard;
