import { useState, useRef, useEffect } from "react";
import { useTodo } from "./../../contexts/TodoContext";
import { useToast } from "./../../contexts/ToastContext";
import { InputField, BlueButton } from "./../index";

function TodoForm({ editingTodo = null, onSave = () => {} }) {
  const [formData, setFormData] = useState({
    content: "",
    label: "General",
    dueDate: "",
    id: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [customLabel, setCustomLabel] = useState("General");
  const [isCustomLabel, setIsCustomLabel] = useState(false);
  const [showLabelSuggestions, setShowLabelSuggestions] = useState(false);

  const { addTodo, updateTodo, labels } = useTodo();
  const { addToast } = useToast();
  const labelInputRef = useRef(null);

  // Load editing todo into form
  useEffect(() => {
    if (editingTodo) {
      setFormData({
        content: editingTodo.content || "",
        label: editingTodo.label || "General",
        dueDate: editingTodo.dueDate || "",
        id: editingTodo.id || editingTodo._id || null,
      });
      setCustomLabel(editingTodo.label || "General");
    } else {
      resetForm();
    }
  }, [editingTodo]);

  const resetForm = () => {
    setFormData({
      content: "",
      label: "General",
      dueDate: "",
      id: null,
    });
    setCustomLabel("General");
    setIsCustomLabel(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLabelChange = (e) => {
    const value = e.target.value;
    setCustomLabel(value);
    const labelExists = labels.includes(value);
    setIsCustomLabel(!labelExists);
    setFormData((prev) => ({ ...prev, label: value }));
    setShowLabelSuggestions(value.length > 0 && !labelExists);
  };

  const handleLabelFocus = () => {
    if (customLabel.length > 0) setShowLabelSuggestions(true);
  };

  const handleLabelBlur = () => {
    setTimeout(() => setShowLabelSuggestions(false), 200);
  };

  const selectLabel = (label) => {
    setFormData((prev) => ({ ...prev, label }));
    setCustomLabel(label);
    setIsCustomLabel(false);
    setShowLabelSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedContent = formData.content.trim();
    const trimmedLabel = isCustomLabel
      ? customLabel.trim()
      : formData.label.trim();

    if (!trimmedContent) {
      addToast({ type: "error", title: "Validation Error", message: "Content is required" });
      return;
    }

    if (!trimmedLabel) {
      addToast({ type: "error", title: "Validation Error", message: "Label is required" });
      return;
    }

    setIsLoading(true);

    const todoData = {
      content: trimmedContent,
      label: trimmedLabel,
      dueDate: formData.dueDate || null,
    };

    let result;
    if (formData.id) {
      result = await updateTodo(formData.id, todoData);
    } else {
      result = await addTodo(todoData);
    }

    if (result?.success) {
      addToast({
        type: "success",
        title: formData.id ? "Todo Updated" : "Todo Added",
        message: formData.id
          ? "Your todo has been updated successfully."
          : "Your new todo has been added successfully.",
      });
      resetForm();
      onSave();
    } else {
      addToast({
        type: "error",
        title: "Save Failed",
        message: result?.message || "Failed to save todo.",
      });
    }

    setIsLoading(false);
  };

  const filteredLabels = labels.filter((label) =>
    label.toLowerCase().includes(customLabel.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-3" id="todo-form" name="todo-form">
      <div className="flex gap-2">
        <InputField
          type="text"
          name="content"
          id="todo-content"
          placeholder="Write Todo Content"
          label="Write Todo Content"
          value={formData.content}
          onChange={handleChange}
          disabled={isLoading}
          textArea
          button={
            <BlueButton
              type="submit"
              disabled={
                isLoading || !formData.content.trim() || !customLabel.trim()
              }
            >
              {isLoading
                ? formData.id
                  ? "Updating..."
                  : "Adding..."
                : formData.id
                ? "Update"
                : "Add"}
            </BlueButton>
          }
        />
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <InputField
            ref={labelInputRef}
            type="text"
            name="todo-label"
            id="todo-label"
            label="Label"
            placeholder="Enter Label"
            value={customLabel}
            onChange={handleLabelChange}
            onFocus={handleLabelFocus}
            onBlur={handleLabelBlur}
            disabled={isLoading}
            autoComplete="off"

          />

          {showLabelSuggestions && filteredLabels.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-600 rounded-lg shadow-lg z-20 max-h-32 overflow-y-auto">
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

        <div className="flex flex-col gap-1 md:flex-none md:w-48">
          <InputField
            type="datetime-local"
            name="dueDate"
            id="dueDate"
            title="Due Date"
            label="Due Date"
            value={formData.dueDate}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>

    </form>
  );
}

export default TodoForm;
