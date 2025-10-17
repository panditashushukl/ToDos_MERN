import { HiOutlineX } from "react-icons/hi";
import { LabelCard, NavCard, ProfileCard, SearchComponent, SocialCard } from "./index";

export default function Sidebar({
  isOpen,
  onClose,
}) {

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white w-72 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      style={{ zIndex: 10 }}
      aria-label="Sidebar Navigation"
    >
      {/* Close button */}
      <button
        aria-label="Close menu"
        className="absolute top-1 right-1 text-3xl text-gray-400 hover:text-white transition-colors"
        onClick={onClose}
      >
        <HiOutlineX />
      </button>
      
      <div className="w-full">
        <ProfileCard />
      </div>

      {/* Scrollable content wrapper */}
      <div className="flex-grow overflow-y-auto">

        {/* Search Section */}
        <SearchComponent />

        {/* Navigation Section */}
        <NavCard />

        {/* Labels Section */}
        <LabelCard />


      </div>
      {/* Social Section */}
      <SocialCard />
    </aside>
  );
}
