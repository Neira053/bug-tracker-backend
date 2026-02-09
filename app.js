const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const bugRoutes = require("./routes/bugRoutes");
const errorHandler = require("./middlewares/errorMiddleware");

const app = express();

/* =======================
   ✅ CORS (FIXED)
   ======================= */

const allowedOrigins = [
  "http://localhost:3000",
  "https://bug-tracker-frontend-one-alpha.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests from Postman / curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests
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
   ROOT
   ======================= */

app.get("/", (req, res) => {
  res.send("Bug Tracker API running");
});

/* =======================
   ERROR HANDLER (LAST)
   ======================= */

app.use(errorHandler);

module.exports = app;
