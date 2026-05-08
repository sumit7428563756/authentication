const express = require('express');
const authRoutes = require("./routes/auth.routes");

console.log("auth routes loaded");

const app = express();

 app.use(express.json());

 app.use("/api/auth",authRoutes);

module.exports = app;