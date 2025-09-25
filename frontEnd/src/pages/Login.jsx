import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

function Login() {
  const [currState, setCurrState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  // Handle profile pic selection
  const handleProfilePic = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setProfilePic(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (currState === "Sign Up") {
      if (!isDataSubmitted) {
        if (!fullName || !email || !password) {
          return toast.error("Fill all required fields");
        }
        setIsDataSubmitted(true); // Move to Bio + ProfilePic step
        return;
      } else {
        if (!bio) return toast.error("Enter your bio");
      }
    } else {
      if (!email || !password) return toast.error("Enter email and password");
    }

    setLoading(true);

    try {
      if (currState === "Sign Up") {
        // Signup API call
        await login("signup", { fullName, email, password, bio, profilePic });
      } else {
        // Login API call
        await login("login", { email, password });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-900 text-white">
      {/* Left section */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-br from-purple-700 to-blue-600">
        <img src={assets.logo_big} alt="Logo" className="w-48" />
      </div>

      {/* Right section */}
      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md"
        >
          <h2 className="flex items-center justify-between text-2xl font-bold mb-6">
            {currState}
            <img
              src={assets.arrow_icon}
              className="w-5 h-5 cursor-pointer"
              alt="arrow"
            />
          </h2>

          {/* Step 1: Full Name (Signup only) */}
          {currState === "Sign Up" && !isDataSubmitted && (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          )}

          {/* Email + Password */}
          {!isDataSubmitted && (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </>
          )}

          {/* Step 2: Bio + Profile Pic */}
          {currState === "Sign Up" && isDataSubmitted && (
            <>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Enter Bio"
                required
                className="w-full mb-4 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                onChange={handleProfilePic}
                className="mb-4"
              />
              {profilePic && (
                <img
                  src={profilePic}
                  alt="preview"
                  className="w-20 h-20 rounded-full mb-4 object-cover"
                />
              )}
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition mb-4 disabled:opacity-50"
          >
            {currState === "Sign Up"
              ? isDataSubmitted
                ? "Finish Sign Up"
                : "Create Account"
              : "Login Now"}
          </button>

          {/* Terms */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <input type="checkbox" required />
            <p>Agree to the terms and conditions</p>
          </div>

          {/* Switch login/signup */}
          <p className="mt-4 text-sm text-gray-400 text-center">
            {currState === "Sign Up" ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setCurrState("Login");
                    setIsDataSubmitted(false);
                  }}
                  className="text-purple-400 cursor-pointer hover:underline"
                >
                  Login
                </span>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <span
                  onClick={() => {
                    setCurrState("Sign Up");
                    setIsDataSubmitted(false);
                  }}
                  className="text-purple-400 cursor-pointer hover:underline"
                >
                  Sign Up
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
