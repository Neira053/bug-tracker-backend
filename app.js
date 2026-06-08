const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const bugRoutes = require("./routes/bugRoutes");
const errorHandler = require("./middlewares/errorMiddleware");

const app = express();

/* =======================
   CORS
   ======================= */

app.use(
  cors({
    origin: true,
    credentials: true,
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
   ERROR HANDLER
   ======================= */

app.use(errorHandler);

module.exports = app;