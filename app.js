const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/authRoutes.js");
const projectRoutes = require("./routes/projectRoutes.js");
const bugRoutes = require("./routes/bugRoutes.js");
const errorHandler = require("./middlewares/errorMiddleware.js");


app.use("/api/project", projectRoutes);
app.use("/api/auth", authRoutes);
app.use(cors());
app.use("/api/bugs", bugRoutes);
// after routes
app.use(errorHandler);


app.get("/", (req, res) => {
  res.send("Bug Tracker API running");
});

module.exports = app;
