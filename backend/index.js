import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import packageRoute from "./routes/package.route.js";
import ratingRoute from "./routes/rating.route.js";
import bookingRoute from "./routes/booking.route.js";
import paymentRoutes from "./routes/payment.routes.js";
import { connectDB } from "./config/connectDB.js";
import askAiRoutes from "./routes/askAi.route.js";

// ---- FIXED DIRNAME SETUP ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- LOAD ENV (CORRECT WAY) ----
dotenv.config({ path: path.join(__dirname, ".env") });


const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.SERVER_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/images", express.static("uploads"));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/package", packageRoute);
app.use("/api/rating", ratingRoute);
app.use("/api/booking", bookingRoute);
app.use("/payment", paymentRoutes);
app.use("/api/ai/ask",askAiRoutes);

if (process.env.NODE_ENV_CUSTOM === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Welcome to travel and tourism app");
  });
}

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
