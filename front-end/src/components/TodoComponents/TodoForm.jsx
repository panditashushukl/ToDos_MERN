import { useState, useRef, useEffect } from "react";
import { useTodo } from "../../contexts/TodoContext";

function TodoForm() {
  const [formData, setFormData] = useState({
    content: "",
    label: "General",
    dueDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showLabelSuggestions, setShowLabelSuggestions] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  const [isCustomLabel, setIsCustomLabel] = useState(false);
  const { addTodo, labels } = useTodo();
  const labelInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLabelChange = (e) => {
    const value = e.target.value;
    setCustomLabel(value);
    
    if (labels.includes(value)) {
      setIsCustomLabel(false);
      setFormData({ ...formData, label: value });
      setShowLabelSuggestions(false);
    } else {
      setIsCustomLabel(true);
      setShowLabelSuggestions(value.length > 0);
    }
  };

  const handleLabelFocus = () => {
    setShowLabelSuggestions(true);
  };

  const handleLabelBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowLabelSuggestions(false);
    }, 200);
  };

  const selectLabel = (label) => {
    setFormData({ ...formData, label });
    setCustomLabel(label);
    setIsCustomLabel(false);
    setShowLabelSuggestions(false);
  };

  const filteredLabels = labels.filter(label => 
    label.toLowerCase().includes(customLabel.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setIsLoading(true);
    
    const todoData = {
      content: formData.content.trim(),
      label: isCustomLabel ? customLabel : formData.label,
      dueDate: formData.dueDate || null,
    };

    const result = await addTodo(todoData);
    
    if (result.success) {
      setFormData({
        content: "",
        label: "General",
        dueDate: "",
      });
      setCustomLabel("");
      setIsCustomLabel(false);
    }
    
    setIsLoading(false);
  };

  // Initialize customLabel when formData.label changes
  useEffect(() => {
    if (!isCustomLabel) {
      setCustomLabel(formData.label);
    }
  }, [formData.label, isCustomLabel]);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          name="content"
          placeholder="Write Todo..."
          className="flex-1 border border-black/10 rounded-l-lg px-3 outline-none duration-150 bg-white/20 py-1.5"
          value={formData.content}
          onChange={handleChange}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !formData.content.trim()}
          className="rounded-r-lg px-3 py-1 bg-green-600 text-white shrink-0 disabled:opacity-50"
        >
          {isLoading ? "Adding..." : "Add"}
        </button>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={labelInputRef}
            type="text"
            name="label"
            value={customLabel}
            onChange={handleLabelChange}
            onFocus={handleLabelFocus}
            onBlur={handleLabelBlur}
            placeholder="Label (e.g., Work, Personal, Shopping)"
            className="w-full px-3 py-1.5 border border-black/10 rounded-lg bg-white/20 text-sm"
            disabled={isLoading}
          />
          
          {/* Label Suggestions Dropdown */}
          {showLabelSuggestions && filteredLabels.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 max-h-32 overflow-y-auto">
              {filteredLabels.map((label) => (
                <div
                  key={label}
                  className="px-3 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer"
                  onClick={() => selectLabel(label)}
                >
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <input
          type="datetime-local"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="px-3 py-1.5 border border-black/10 rounded-lg bg-white/20 text-sm"
          disabled={isLoading}
        />
      </div>
    </form>
  );
}

export default TodoForm;
