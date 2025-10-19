import { useState } from "react";
import { useAuth } from "./../../contexts/AuthContext";
import { BlueButton, InputField, PhotoInput } from "../index";

const RegisterForm = ({ onSwitchToLogin, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [isAvatarEditing, setIsAvatarEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/;
    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be 8-12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let avatarFile = null;

      if (avatar) {
        const response = await fetch(avatar);
        const blob = await response.blob();

        avatarFile = new File([blob], "avatar.jpg", { type: blob.type });
      }

      if (isAvatarEditing) {
        return;
      }

      const result = await register(
        formData.fullName,
        formData.username,
        formData.password,
        avatarFile
      );

      if (result && result.success) {
        onClose?.();
        onSwitchToLogin?.();
      } else {
        const errMsg =
          result?.error || "Registration failed. Please try again.";
        setError(errMsg);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-2xl text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Register</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Full Name"
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          placeholder="Enter your full name"
          className="focus:ring-blue-500 border-gray-700"
        />

        <InputField
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          placeholder="Choose a username"
          className="focus:ring-blue-500 border-gray-700"
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Create a password"
          className="focus:ring-blue-500 border-gray-700"
        />

        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          placeholder="Confirm your password"
          className="focus:ring-blue-500 border-gray-700"
        />

        <PhotoInput
          preview={avatar}
          setPreview={setAvatar}
          label="Avatar (Optional)"
          labelFor="avatar"
          setIsAvatarEditing={setIsAvatarEditing}
        />

        {error && (
          <div className="text-red-400 text-sm bg-red-900 bg-opacity-30 p-2 rounded">
            {error}
          </div>
        )}

        <BlueButton
          type="submit"
          disabled={isLoading || isAvatarEditing}
          className="w-full"
        >
          {isLoading ? "Creating Account..." : "Register"}
        </BlueButton>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-400 hover:text-blue-600 font-medium"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
