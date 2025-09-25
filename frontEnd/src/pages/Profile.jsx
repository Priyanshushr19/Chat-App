import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

function Profile() {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectImg, setSelectImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectImg) {
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate("/");
    };
  };

  return (
    <div className="bg-gradient-to-br from-gray-400 via-gray-700 to-black  min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-400 shadow-2xl rounded-2xl w-full max-w-lg p-8 relative">
        {/* Logo top-right */}
        <img
          src={assets.logo_icon}
          className="absolute top-4 right-4 w-10 h-10 object-contain"
          alt="Logo"
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <h3 className="text-2xl font-bold text-gray-700 text-center mb-4">
            Profile Settings
          </h3>

          {/* Avatar Upload */}
          <label
            htmlFor="avatar"
            className="flex flex-col items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setSelectImg(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png,.jpg,.jpeg"
              hidden
            />
            <img
              src={
                selectImg
                  ? URL.createObjectURL(selectImg)
                  : authUser?.profilePic || assets.avatar_icon
              }
              alt="Avatar"
              className="w-28 h-28 rounded-full border-4 border-gray-300 object-cover shadow-md"
            />
            <span className="text-blue-500 font-medium hover:underline">
              Change Profile Picture
            </span>
          </label>

          {/* Name */}
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your Name"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-gray-50"
          />

          {/* Bio */}
          <textarea
            required
            placeholder="Write something about yourself..."
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none resize-none bg-gray-50"
          ></textarea>

          {/* Save Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-medium shadow-md"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
