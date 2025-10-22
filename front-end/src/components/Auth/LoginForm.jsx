import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { BlueButton, InputField } from "../index";

const LoginForm = ({ onSwitchToRegister, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login(formData.username, formData.password);

    if (result.success) {
      onClose?.();
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Login</h2>
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
          label="Username"
          type="text"
          name="username"
          id="l-username"
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
          id="l-password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="Create a password"
          className="focus:ring-blue-500 border-gray-700"
        />

        {error && (
          <div className="text-red-400 text-sm bg-red-900 bg-opacity-30 p-2 rounded">
            {error}
          </div>
        )}

        <BlueButton type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Logging in..." : "Login"}
        </BlueButton>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-400 hover:text-blue-600 font-medium"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
