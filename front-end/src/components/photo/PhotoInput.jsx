import { useState } from "react";
import EditPhoto from "../photo/EditPhoto";
import PhotoCropper from "../photo/PhotoCropper";

const PhotoInput = ({
  label = "",
  labelFor = "",
  preview,
  setPreview,
  setIsAvatarEditing
}) => {
  const [photoURL, setPhotoURL] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const handlePhotoChange = (e) => {
    setIsAvatarEditing?.(true)
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = URL.createObjectURL(file);
      setPhotoURL(imageDataUrl);
      setShowCropper(true);
    }
  };

  const handleCropSave = (croppedImage) => {
    setPreview(croppedImage);
    setShowCropper(false);
    setIsAvatarEditing?.(false)
  };

  return (
    <div>
      {label && (
        <label htmlFor={labelFor} className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}

      <EditPhoto preview={preview} handlePhotoChange={handlePhotoChange} />

      {showCropper && photoURL && (
        <PhotoCropper
          photoURL={photoURL}
          setShowCropper={setShowCropper}
          setPreview={handleCropSave}
        />
      )}
    </div>
  );
};

export default PhotoInput;
