import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import userRoute from "./routes/userRoutes.js";
import errorHandling from "./middlewares/errorHandler.js";
import authRoute from "./routes/auth.route.js";
import blogRoute from "./routes/blog.route.js";
import likeRoute from "./routes/like.route.js";

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1", userRoute);
app.use("/api/v1", authRoute);
app.use("/api/v1", blogRoute);
app.use("/api/v1", likeRoute);

// error handling middleware
app.use(errorHandling);

// server sunning

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
