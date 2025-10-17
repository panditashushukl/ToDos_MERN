const InputField = ({
  label,
  placeholder = '',
  type = 'text',
  value,
  onChange,
  name,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full mb-4 ${props.wrapperClassName || ''}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        id={name}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ${className}`}
        {...props}
      />
    </div>
  );
};

export default InputField;
