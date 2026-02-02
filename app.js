const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes.js");
const projectRoutes = require("./routes/projectRoutes.js");
const bugRoutes = require("./routes/bugRoutes.js");
const errorHandler = require("./middlewares/errorMiddleware.js");

const app = express();

/* =======================
   ✅ CORS MUST COME FIRST
   ======================= */
app.use(
  cors({
    origin: [
      "http://localhost:3000", // frontend (local)
      // add frontend deployed URL later (vercel/netlify)
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// handle preflight requests
app.options("*", cors());

/* =======================
   BODY PARSERS
   ======================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   ROUTES
   ======================= */
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/bugs", bugRoutes);

/* =======================
   ROOT CHECK
   ======================= */
app.get("/", (req, res) => {
  res.send("Bug Tracker API running");
});

/* =======================
   ERROR HANDLER (LAST)
   ======================= */
app.use(errorHandler);

module.exports = app;
