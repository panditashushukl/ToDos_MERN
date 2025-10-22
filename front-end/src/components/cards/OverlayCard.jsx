import  { useEffect, useRef } from "react";

const OverlayCard = ({
  onClose,
  children,
  position = { top: 60, right: 20 },
}) => {
  const ref = useRef(null);

  // Close the card when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute z-50 w-64 bg-gray-800 shadow-lg rounded-lg p-2"
      style={{ top: position.top, right: position.right }}
    >
      {children}
    </div>
  );
};

export default OverlayCard;
