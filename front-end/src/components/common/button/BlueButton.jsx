import PropTypes from 'prop-types';

const BlueButton = ({ onClick, children, className = '', ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`
        bg-blue-600 
        hover:bg-blue-700 
        text-white 
        font-semibold 
        py-2 px-4 
        rounded-full 
        transition-colors 
        duration-200 
        focus:outline-none 
        focus:ring-2 
        focus:ring-blue-400 
        focus:ring-opacity-75
        disabled:opacity-50 
        disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

BlueButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default BlueButton;
