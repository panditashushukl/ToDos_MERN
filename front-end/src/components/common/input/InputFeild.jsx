import { useId } from "react";

const InputField = ({
  label,
  placeholder = "",
  type = "text",
  value,
  onChange,
  id,
  required = false,
  className = "",
  Icon,
  button,
  textArea=false,
  ...props
}) => {
  const Component = textArea ? "textarea" : "input";
  const inputId = id || useId();

  return (
    <div className={`relative w-full mb-6 ${props.wrapperClassName || ""}`}>
      {/* Icon on the left */}
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
      )}

      {/* Input */}
      <Component
        type={type}
        id={inputId}
        required={required}
        value={value}
        onChange={onChange}
        placeholder=" "
        className={`peer w-full bg-gray-800 text-white placeholder-transparent border border-gray-700 rounded-lg px-4 ${
          Icon ? "pl-10" : ""
        } ${button ? "pr-20" : ""} py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ${className}`}
        {...props}
      />
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={`absolute ${
            Icon ? "left-10" : "left-4"
          } text-sm transition-all duration-150 transform origin-left px-1
            bg-gray-800 z-10
            peer-placeholder-shown:top-2.5
            peer-placeholder-shown:scale-100
            peer-placeholder-shown:text-base
            peer-placeholder-shown:text-gray-500
            ${
              (value || type === "date"  || type==="time")
                ? "top-[-0.6rem] scale-90 text-indigo-400"
                : "peer-focus:top-[-0.6rem] peer-focus:scale-90 peer-focus:text-indigo-400"
            }
          `}
        >
          {label}
        </label>
      )}

      {/* Button on the right */}
      {button && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20">
          {button}
        </div>
      )}
    </div>
  );
};

export default InputField;
