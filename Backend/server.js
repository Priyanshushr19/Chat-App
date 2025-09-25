import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import userRouter from "./Routes/UserRoutes.js";
import messageRouter from "./Routes/MessageRoutes.js";
import { Server } from "socket.io";
import { connectDB } from "./lib/db.js";
import cloudinary from "./lib/cloudinary.js";

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(
    cors({
        origin: "http://localhost:5173", // ✅ Vite frontend port
        credentials: true,               // ✅ allow cookies & headers
    })
);

// Root route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Socket.io server
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

// Store online users
export const userSocketMap = {};

// Socket.io connection
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected:", userId);

    if (userId) userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected:", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// Routes
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);





// Start server
const main = async () => {
    await connectDB();
    const PORT = process.env.PORT || 3000; // ✅ use 5000 instead of 3000
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

main();
