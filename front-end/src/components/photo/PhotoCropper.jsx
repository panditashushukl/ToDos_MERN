import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./../../utilities/cropImage";

const PhotoCropper = ({ photoURL, setShowCropper, setPreview }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(photoURL, croppedAreaPixels);
      setPreview(croppedImage);
      setShowCropper(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg w-full max-w-md relative text-white">
        <div className="relative w-full h-64 bg-gray-700">
          <Cropper
            image={photoURL}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setShowCropper(false)}
            className="px-4 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleCropSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoCropper;
