import { useTodo } from "./../../contexts/TodoContext";

const LabelCard = () => {
  const { labels, handleLabelFilterChange } = useTodo();

  if (!labels || labels.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-2">Labels</h3>
      <div className="space-y-1">
        {labels.slice(0, 5).map((label) => (
          <div
            key={label}
            className="text-sm text-gray-400 hover:text-white cursor-pointer py-1 px-2 rounded hover:bg-gray-800"
            onClick={() => handleLabelFilterChange(`${label}`)}
          >
            #{label}
          </div>
        ))}
        {labels.length > 5 && (
          <div className="text-xs text-gray-500">
            +{labels.length - 5} more labels
          </div>
        )}
      </div>
    </div>
  );
};

export default LabelCard;
