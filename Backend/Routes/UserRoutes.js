import express from 'express'
import { checkAuth, login, signUp, updateProfile } from '../controller/userController.js';
import { protectRoute } from '../Middleware/Auth.js';
import cloudinary from '../lib/cloudinary.js';
const userRouter=express.Router();

userRouter.post("/signup",signUp)
userRouter.post("/login",login);
userRouter.put("/update-profile",protectRoute,updateProfile)
userRouter.get("/check",protectRoute,checkAuth)



export default userRouter