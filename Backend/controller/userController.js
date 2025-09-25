import { generateToken } from "../lib/utils.js";
import User from "../Modals/user.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";

// Register
export const signUp = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing entries" });
        }

        const user = await User.findOne({ email });
        if (user) return res.json({ success: false, message: "Already exists" });

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPass,
            bio,
        });

        const token = generateToken(newUser._id);
        res.json({ success: true, userData: newUser, token, message: "Created Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });

        // console.log(email,password);

        if (!userData) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        const isPassCorr = await bcrypt.compare(password, userData.password);

        if (!isPassCorr) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        const token = generateToken(userData._id);
        res.json({ success: true, userData, token, message: "Login Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Check Auth
export const checkAuth = (req, res) => {
    res.json({ success: true, user: req.user });
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedUser;

    if (!profilePic) {
      // Only update text fields
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      // ✅ Upload to cloudinary with folder & transformation
      const upload = await cloudinary.uploader.upload(profilePic, {
        folder: "user_profiles",
        resource_type: "image",
      });

      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res
      .status(500)
      .json({ success: false, message: "Image upload failed: " + error.message });
  }
};
