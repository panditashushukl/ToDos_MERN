import { useState } from "react";
import { PhotoInput, BlueButton, InputField } from "./../index";
import { apiService } from "./../../services/api";
import { useAuth } from "./../../contexts/AuthContext";
import { useToast } from "./../../contexts/ToastContext";

export default function ProfileEditCard() {
  const [editName, setEditName] = useState(false);
  const [editPhoto, setEditPhoto] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const [name, setName] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })

  const handlePasswordChange = (e) => {
    setPassword({
      ...password,
      [e.target.name] : e.target.value,
    })
  }

  const { addToast } = useToast();

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let data = null;

      if (editName && name.trim() !== "") {
        data = await apiService.updateProfile({ fullName: name });
        updateUser({ fullName: name });
        addToast({ type: "success", message: "Name updated successfully!" });
        setEditName(false);
        setName("");
      }

      if (
        editPassword &&
        password.oldPassword.trim() &&
        password.newPassword.trim() &&
        password.confirmNewPassword.trim()
      ) {
        if (!validatePassword()) {
          setLoading(false);
          return;
        }

        data = await apiService.changePassword(password.oldPassword, password.newPassword);
        addToast({
          type: "success",
          message: "Password updated successfully!",
        });
        setEditPassword(false);
        setPassword({
          oldPassword:"",
          newPassword:"",
          confirmNewPassword:"",
        })
      }

      if (editPhoto && preview) {
        const blob = await (await fetch(preview)).blob();
        const file = new File([blob], "avatar.jpg", { type: blob.type });
        data = await apiService.updateAvatar(file);
        const avatar = data?.data?.avatar;
        updateUser({ avatar });
        addToast({ type: "success", message: "Profile photo updated!" });
        setEditPhoto(false);
        setPreview(null);
      }

      if (!data) {
        addToast({ type: "info", message: "No changes were made." });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      addToast({
        type: "error",
        message: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    if (password.newPassword !== password.confirmNewPassword) {
      addToast({ type: "error", message: "Passwords do not match." });
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/;
    if (!passwordRegex.test(password.newPassword)) {
      addToast({
        type: "error",
        message:
          "Password must be 8‑12 characters and include uppercase, lowercase, number, & special character.",
      });
      return false;
    }

    return true;
  };

  const canSubmit =
    (editName && name.trim()) ||
    (editPhoto && preview !== null) ||
    (editPassword &&
      password.oldPassword.trim() &&
      password.newPassword.trim() &&
      password.confirmNewPassword.trim());

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6 text-white">
      <div className="bg-gray-800 shadow-xl rounded-xl p-8 max-w-md w-full space-y-8 border border-gray-700">
        <h3 className="text-3xl font-bold text-white text-center">
          Edit Profile
        </h3>

        {/* Edit Name Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-lg text-gray-200">Edit Name?</span>
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
            disabled={loading}
          />
        )}

        {/* Change Password Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-lg text-gray-200">Change Password?</span>
          <div
            onClick={() => setEditPassword(!editPassword)}
            className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition duration-300 ${
              editPassword ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                editPassword ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>

        {editPassword && (
          <>
            <InputField
              type="password"
              placeholder="Enter old Password"
              label="Old Password"
              name="oldPassword"
              value={password.oldPassword}
              onChange={handlePasswordChange}
              disabled={loading}
            />

            <InputField
              type="text"
              placeholder="Enter new Password"
              label="New Password"
              name="newPassword"
              value={password.newPassword}
              onChange={handlePasswordChange}
              disabled={loading}
            />

            <InputField
              type="password"
              placeholder="Confirm new Password"
              label="Confirm New Password"
              name="confirmNewPassword"
              value={password.confirmNewPassword}
              onChange={handlePasswordChange}
              disabled={loading}
            />
          </>
        )}

        {/* Edit Photo Toggle */}
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
            disabled={loading}
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
