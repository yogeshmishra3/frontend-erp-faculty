import React, { useState } from "react";
import { User, Lock, Building, BookOpen, School } from "lucide-react"; // Adjust import if needed

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://backend-erp-faculty.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role }),
        }
      );

      const data = await response.json();
      console.log("Backend Response:", data);

      if (!response.ok) {
        setError(
          data.message || "Login failed. Please check your credentials."
        );
      } else if (data.token) {
        localStorage.setItem("authToken", data.token);
        if (rememberMe) {
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userRole", role);
        }
        alert("Login successful");
        // Redirect to dashboard or another page
      } else {
        setError("Unexpected error. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        "Unable to connect to the server. Please make sure the backend is running on port 5000."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case "director":
        return <Building className="h-6 w-6 text-blue-600" />;
      case "faculty-management":
        return <BookOpen className="h-6 w-6 text-blue-600" />;
      case "faculty":
        return <School className="h-6 w-6 text-blue-600" />;
      case "student":
        return <User className="h-6 w-6 text-blue-600" />;
      default:
        return <User className="h-6 w-6 text-blue-600" />;
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
            {getRoleIcon()}
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form className="mt-4 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg w-full px-3 py-3 pl-10 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-lg w-full px-3 py-3 pl-10 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Uncomment and use if you want role selection */}
            {/* 
            <div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-lg w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="director">Director</option>
                <option value="faculty-management">Faculty Management</option>
                <option value="faculty">Faculty</option>
                <option value="student">Student</option>
              </select>
            </div>
            */}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-900">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2">Remember me</span>
            </label>
            <a className="text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
              Forgot your password?
            </a>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-white ${
                isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
