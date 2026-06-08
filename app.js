const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const bugRoutes = require("./routes/bugRoutes");
const errorHandler = require("./middlewares/errorMiddleware");

const app = express();

/* =======================
   ✅ CORS (FIXED + SAFE)
   ======================= */

const allowedOrigins = [
  "http://localhost:3000",
  "https://bug-tracker-frontend-one-alpha.vercel.app",
  "https://bug-tracker-frontend-git-main-nehapaswan2806-9024s-projects.vercel.app/",
  "https://bug-tracker-frontend-6011woh5v-nehapaswan2806-9024s-projects.vercel.app/"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
