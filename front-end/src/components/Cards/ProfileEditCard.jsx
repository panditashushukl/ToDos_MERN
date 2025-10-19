import { useState } from "react";
import { PhotoInput, BlueButton, InputField } from "./../index";
import { apiService } from "./../../services/api";
import { useAuth } from "./../../contexts/AuthContext";

export default function ProfileEditCard() {
  const [editName, setEditName] = useState(false);
  const [editPhoto, setEditPhoto] = useState(false);
  const [name, setName] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (editName && name.trim() !== "") {
        await apiService.updateProfile({ fullName: name });
        updateUser({ fullName: name });
      }

      if (editPhoto && preview) {
        const blob = await (await fetch(preview)).blob();
        const file = new File([blob], "avatar.jpg", { type: blob.type });
        const result = await apiService.updateAvatar(file);
        const avatar = result?.data?.avatar;
        updateUser({ avatar });
      }

      alert("Profile updated successfully!");
      setEditName(false);
      setEditPhoto(false);
      setName("");
      setPreview(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit =
    (editName && name.trim() !== "") || (editPhoto && preview !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6 text-white">
      <div className="bg-gray-800 shadow-xl rounded-xl p-8 max-w-md w-full space-y-8 border border-gray-700">
        <h2 className="text-3xl font-bold text-white text-center">
          Edit Profile
        </h2>

        {/* Edit Name Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-lg text-gray-200">Edit Full Name?</span>
          <div
            onClick={() => setEditName(!editName)}
            className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition duration-300 ${
              editName ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                editName ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>

        {editName && (
          <InputField
            type="text"
            placeholder="Enter your new Name"
            label="Enter new Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg text-gray-200">Edit Profile Photo?</span>
          <div
            onClick={() => setEditPhoto(!editPhoto)}
            className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition duration-300 ${
              editPhoto ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                editPhoto ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>

        {editPhoto && (
          <PhotoInput
            preview={preview}
            setPreview={setPreview}
            label="Upload Profile Photo"
            labelFor="profile-photo"
          />
        )}

        {/* Submit Button */}
        {canSubmit && (
          <BlueButton
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-4"
          >
            {loading ? "Submitting..." : "Submit Changes"}
          </BlueButton>
        )}
      </div>
    </div>
  );
}
