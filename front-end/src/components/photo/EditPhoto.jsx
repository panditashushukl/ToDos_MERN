const EditPhoto = ({preview, handlePhotoChange}) => {
  return (
    <div className="w-full mt-4">
      <label
        htmlFor="photo-upload"
        className="flex items-center justify-center w-full h-44 bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:bg-gray-600 transition"
      >
        {preview ? (
          <div className="flex flex-col items-center">
            <img
              src={preview}
              alt="Profile Preview"
              className="w-24 h-24 object-cover rounded-full shadow-md"
            />
            <p className="text-sm text-gray-300 mt-2">Click to change photo</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16l4-4a4 4 0 015.656 0L21 3M15 7h2a2 2 0 012 2v9a2 2 0 01-2 2H7a2 2 0 01-2-2v-2"
              />
            </svg>
            <p className="text-gray-400">Click to upload photo</p>
          </div>
        )}
      </label>
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
      />
    </div>
  );
};

export default EditPhoto;
